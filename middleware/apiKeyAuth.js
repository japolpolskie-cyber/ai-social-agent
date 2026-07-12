// ======================================================
// API Key Authentication Middleware
// ======================================================

const crypto = require(
  "node:crypto"
);

const securityConfig = require(
  "../config/security"
);

// ======================================================
// Helpers
// ======================================================

function createAuthenticationError(
  message,
  code
) {
  const error =
    new Error(
      message
    );

  error.name =
    "APIAuthenticationError";

  error.code =
    code;

  error.statusCode =
    401;

  return error;
}

function normalizeKey(
  value
) {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value.trim();
}

function securelyCompareKeys(
  providedKey,
  expectedKey
) {
  const providedBuffer =
    Buffer.from(
      providedKey,
      "utf8"
    );

  const expectedBuffer =
    Buffer.from(
      expectedKey,
      "utf8"
    );

  if (
    providedBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    providedBuffer,
    expectedBuffer
  );
}

// ======================================================
// Middleware
// ======================================================

function apiKeyAuth(
  req,
  res,
  next
) {
  const configuration =
    securityConfig
      .apiAuthentication;

  if (
    !configuration.enabled
  ) {
    next();

    return;
  }

  const expectedKey =
    normalizeKey(
      configuration.apiKey
    );

  if (!expectedKey) {
    next(
      createAuthenticationError(
        "API authentication is enabled but no API key is configured.",
        "API_KEY_NOT_CONFIGURED"
      )
    );

    return;
  }

  const providedKey =
    normalizeKey(
      req.get(
        configuration.headerName
      )
    );

  if (!providedKey) {
    next(
      createAuthenticationError(
        "API key is required.",
        "API_KEY_REQUIRED"
      )
    );

    return;
  }

  if (
    !securelyCompareKeys(
      providedKey,
      expectedKey
    )
  ) {
    next(
      createAuthenticationError(
        "The provided API key is invalid.",
        "INVALID_API_KEY"
      )
    );

    return;
  }

  next();
}

// ======================================================
// Export
// ======================================================

module.exports = {
  apiKeyAuth,
};