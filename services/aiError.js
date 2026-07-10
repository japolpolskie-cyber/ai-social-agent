// ======================================================
// AI Error Classifier
// ======================================================

const ERROR_TYPES = {
  RATE_LIMIT: "rate_limit",
  QUOTA: "quota",
  TIMEOUT: "timeout",
  NETWORK: "network",
  SERVICE_UNAVAILABLE: "service_unavailable",
  AUTHENTICATION: "authentication",
  INVALID_REQUEST: "invalid_request",
  CONFIGURATION: "configuration",
  UNKNOWN: "unknown",
};

const RETRYABLE_ERROR_TYPES = new Set([
  ERROR_TYPES.RATE_LIMIT,
  ERROR_TYPES.QUOTA,
  ERROR_TYPES.TIMEOUT,
  ERROR_TYPES.NETWORK,
  ERROR_TYPES.SERVICE_UNAVAILABLE,
]);

function getErrorMessage(error) {
  if (typeof error === "string") {
    return error;
  }

  return (
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.error?.message ||
    error?.message ||
    "AI generation failed."
  );
}

function getErrorStatus(error) {
  return (
    error?.status ||
    error?.statusCode ||
    error?.response?.status ||
    error?.response?.statusCode ||
    null
  );
}

function classifyAIError(error) {
  const message = getErrorMessage(error);
  const normalizedMessage = message.toLowerCase();
  const status = getErrorStatus(error);

  if (
    status === 429 ||
    normalizedMessage.includes("rate limit") ||
    normalizedMessage.includes("too many requests")
  ) {
    return ERROR_TYPES.RATE_LIMIT;
  }

  if (
    normalizedMessage.includes("quota") ||
    normalizedMessage.includes("resource_exhausted") ||
    normalizedMessage.includes("insufficient_quota")
  ) {
    return ERROR_TYPES.QUOTA;
  }

  if (
    normalizedMessage.includes("timeout") ||
    normalizedMessage.includes("timed out") ||
    normalizedMessage.includes("deadline exceeded") ||
    error?.code === "ETIMEDOUT" ||
    error?.code === "ESOCKETTIMEDOUT"
  ) {
    return ERROR_TYPES.TIMEOUT;
  }

  if (
    normalizedMessage.includes("network") ||
    normalizedMessage.includes("fetch failed") ||
    normalizedMessage.includes("connection refused") ||
    normalizedMessage.includes("connection reset") ||
    error?.code === "ECONNREFUSED" ||
    error?.code === "ECONNRESET" ||
    error?.code === "ENOTFOUND" ||
    error?.code === "EAI_AGAIN"
  ) {
    return ERROR_TYPES.NETWORK;
  }

  if (
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    normalizedMessage.includes("service unavailable") ||
    normalizedMessage.includes("server error") ||
    normalizedMessage.includes("bad gateway")
  ) {
    return ERROR_TYPES.SERVICE_UNAVAILABLE;
  }

  if (
    status === 401 ||
    status === 403 ||
    normalizedMessage.includes("api key") ||
    normalizedMessage.includes("authentication") ||
    normalizedMessage.includes("unauthorized") ||
    normalizedMessage.includes("forbidden") ||
    normalizedMessage.includes("invalid key")
  ) {
    return ERROR_TYPES.AUTHENTICATION;
  }

  if (
    status === 400 ||
    normalizedMessage.includes("invalid request") ||
    normalizedMessage.includes("bad request") ||
    normalizedMessage.includes("invalid prompt") ||
    normalizedMessage.includes("invalid argument")
  ) {
    return ERROR_TYPES.INVALID_REQUEST;
  }

  if (
    normalizedMessage.includes("not configured") ||
    normalizedMessage.includes("not supported") ||
    normalizedMessage.includes("not enabled") ||
    normalizedMessage.includes("no default model") ||
    normalizedMessage.includes("does not belong to provider") ||
    normalizedMessage.includes("missing")
  ) {
    return ERROR_TYPES.CONFIGURATION;
  }

  return ERROR_TYPES.UNKNOWN;
}

function isRetryableAIError(error) {
  const type = classifyAIError(error);

  return RETRYABLE_ERROR_TYPES.has(type);
}

function normalizeAIError(error) {
  const type = classifyAIError(error);
  const originalMessage = getErrorMessage(error);

  switch (type) {
    case ERROR_TYPES.RATE_LIMIT:
      return "AI provider rate limit reached. Please try again later.";

    case ERROR_TYPES.QUOTA:
      return "AI provider quota exceeded. Please try again later or switch provider.";

    case ERROR_TYPES.TIMEOUT:
      return "AI provider request timed out. Please try again.";

    case ERROR_TYPES.NETWORK:
      return "Unable to connect to the AI provider. Please try again.";

    case ERROR_TYPES.SERVICE_UNAVAILABLE:
      return "AI provider is temporarily unavailable. Please try again later.";

    case ERROR_TYPES.AUTHENTICATION:
      return "AI provider authentication failed. Please check the API key.";

    case ERROR_TYPES.INVALID_REQUEST:
      return "The AI provider rejected the request. Please check the request data.";

    case ERROR_TYPES.CONFIGURATION:
      return originalMessage;

    default:
      return originalMessage;
  }
}

function createAIErrorDetails(error) {
  return {
    type: classifyAIError(error),
    message: getErrorMessage(error),
    friendlyMessage: normalizeAIError(error),
    retryable: isRetryableAIError(error),
    status: getErrorStatus(error),
  };
}

module.exports = {
  ERROR_TYPES,
  getErrorMessage,
  getErrorStatus,
  classifyAIError,
  isRetryableAIError,
  normalizeAIError,
  createAIErrorDetails,
};