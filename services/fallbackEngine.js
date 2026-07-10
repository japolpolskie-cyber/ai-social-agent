// ======================================================
// Automatic Fallback Engine
// ======================================================

const providerManager = require("./providerManager");
const modelManager = require("./modelManager");
const providerHealthService = require("./providerHealthService");
const configService = require("./configService");
const { createAIErrorDetails } = require("./aiError");

function getFallbackConfig() {
  const providersConfig = configService.getProviders();

  return providersConfig.fallback || {
    enabled: false,
    order: [],
    policy: {},
  };
}

function shouldFallback(errorType) {
  const fallbackConfig = getFallbackConfig();
  const policy = fallbackConfig.policy || {};

  return Boolean(policy[errorType]);
}

function createProviderOrder(requestedProvider) {
  const fallbackConfig = getFallbackConfig();
  const enabledProviders = providerManager.getEnabledProviders();
  const primaryProvider =
    providerManager.resolveProviderName(requestedProvider);

  const configuredOrder = Array.isArray(fallbackConfig.order)
    ? fallbackConfig.order
    : [];

  const orderedProviders = [
    primaryProvider,
    ...configuredOrder,
    ...enabledProviders,
  ];

  return [...new Set(orderedProviders)].filter((providerName) =>
    providerManager.isProviderEnabled(providerName)
  );
}

function buildCandidates({ provider, model }) {
  const fallbackConfig = getFallbackConfig();
  const providerOrder = createProviderOrder(provider);

  const selectedProviders = fallbackConfig.enabled
    ? providerOrder
    : providerOrder.slice(0, 1);

  return selectedProviders.map((providerName, index) => {
    const requestedModel = index === 0 ? model : undefined;

    const resolvedModel = modelManager.resolveModel(
      providerName,
      requestedModel
    );

    return {
      provider: providerName,
      model: resolvedModel,
    };
  });
}

function createSkippedAttempt(candidate, health) {
  return {
    provider: candidate.provider,
    model: candidate.model.name,
    status: "skipped",
    error: {
      type: "provider_unhealthy",
      message: `Provider "${candidate.provider}" failed its configuration health check.`,
      friendlyMessage: `Provider "${candidate.provider}" is not available.`,
      fallbackAllowed: true,
      health,
    },
  };
}

async function executeCandidate({ candidate, prompt, options }) {
  const selectedProvider = providerManager.getActiveProvider(
    candidate.provider
  );

  return selectedProvider.generate({
    prompt,
    model: candidate.model.model,
    options,
  });
}

function createExecutionError(error, errorDetails, attempts) {
  const executionError = new Error(errorDetails.friendlyMessage);

  executionError.cause = error;
  executionError.details = errorDetails;
  executionError.attempts = attempts;

  return executionError;
}

async function executeWithFallback({
  provider,
  model,
  prompt = "",
  options = {},
}) {
  const candidates = buildCandidates({
    provider,
    model,
  });

  const attempts = [];
  let lastError = null;
  let lastErrorDetails = null;

  for (const candidate of candidates) {
    const health = providerHealthService.checkProvider(
      candidate.provider
    );

    if (!health.healthy) {
      attempts.push(createSkippedAttempt(candidate, health));
      continue;
    }

    const attemptStart = Date.now();

    try {
      const output = await executeCandidate({
        candidate,
        prompt,
        options,
      });

      attempts.push({
        provider: candidate.provider,
        model: candidate.model.name,
        status: "success",
        executionTime: Date.now() - attemptStart,
      });

      return {
        output,
        provider: candidate.provider,
        model: candidate.model.name,
        attempts,
      };
    } catch (error) {
      const errorDetails = createAIErrorDetails(error);
      const fallbackAllowed = shouldFallback(errorDetails.type);

      lastError = error;
      lastErrorDetails = {
        ...errorDetails,
        fallbackAllowed,
      };

      attempts.push({
        provider: candidate.provider,
        model: candidate.model.name,
        status: "failed",
        executionTime: Date.now() - attemptStart,
        error: lastErrorDetails,
      });

      if (!fallbackAllowed) {
        throw createExecutionError(
          error,
          lastErrorDetails,
          attempts
        );
      }
    }
  }

  if (lastError && lastErrorDetails) {
    throw createExecutionError(
      lastError,
      lastErrorDetails,
      attempts
    );
  }

  const unavailableError = new Error(
    "No healthy AI provider is available."
  );

  unavailableError.details = {
    type: "provider_unavailable",
    message: unavailableError.message,
    friendlyMessage: unavailableError.message,
    fallbackAllowed: false,
  };

  unavailableError.attempts = attempts;

  throw unavailableError;
}

module.exports = {
  getFallbackConfig,
  shouldFallback,
  createProviderOrder,
  buildCandidates,
  executeWithFallback,
};