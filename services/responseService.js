// ======================================================
// Response Service
// ======================================================

const appConfig = require(
  "../config/app"
);

const applicationLogger = require(
  "./applicationLogger"
);

function success(
  res,
  data = {},
  statusCode = 200
) {
  return res
    .status(
      statusCode
    )
    .json({
      success: true,
      ...data,
    });
}

function normalizeError(error) {
  if (!error) {
    return {
      code:
        "INTERNAL_SERVER_ERROR",

      message:
        "An unexpected error occurred.",
    };
  }

  if (
    typeof error.toJSON ===
      "function"
  ) {
    return error.toJSON();
  }

  return {
    code:
      error.code ||
      "INTERNAL_SERVER_ERROR",

    message:
      error.message ||
      String(error),

    ...(error.stage
      ? {
          stage:
            error.stage,
        }
      : {}),

    ...(error.details !== undefined &&
    error.details !== null
      ? {
          details:
            error.details,
        }
      : {}),
  };
}

function createPublicError(
  errorValue,
  statusCode,
  environment =
    appConfig.environment
) {
  if (
    environment ===
      "production" &&
    statusCode >= 500
  ) {
    return {
      code:
        "INTERNAL_SERVER_ERROR",

      message:
        "Internal server error",
    };
  }

  return normalizeError(
    errorValue
  );
}

function error(
  res,
  errorValue,
  statusCode = 500
) {
  const safeStatusCode =
    Number.isInteger(
      statusCode
    ) &&
    statusCode >= 400 &&
    statusCode <= 599
      ? statusCode
      : 500;

  const normalizedError =
    normalizeError(
      errorValue
    );

  const publicError =
    createPublicError(
      errorValue,
      safeStatusCode
    );

  applicationLogger.error(
    "Request failed.",
    {
      code:
        normalizedError.code,

      message:
        normalizedError.message,

      stage:
        normalizedError.stage ||
        null,

      statusCode:
        safeStatusCode,
    }
  );

  return res
    .status(
      safeStatusCode
    )
    .json({
      success: false,
      error:
        publicError,
    });
}

module.exports = {
  success,
  normalizeError,
  createPublicError,
  error,
};
