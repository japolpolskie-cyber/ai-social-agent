// ======================================================
// API Key Authentication Tests
// ======================================================

const assert = require(
  "node:assert/strict"
);

process.env.API_AUTH_ENABLED =
  "true";

process.env.AI_SOCIAL_AGENT_API_KEY =
  "test-secret";

const {
  apiKeyAuth,
} = require(
  "./middleware/apiKeyAuth"
);

function authenticate(
  providedKey
) {
  let nextValue = null;

  apiKeyAuth(
    {
      get() {
        return providedKey;
      },
    },
    {},
    (value) => {
      nextValue =
        value === undefined
          ? "allowed"
          : value;
    }
  );

  return nextValue;
}

const missingKey =
  authenticate();

assert.equal(
  missingKey.code,
  "API_KEY_REQUIRED"
);

assert.equal(
  missingKey.statusCode,
  401
);

const invalidKey =
  authenticate(
    "wrong-secret"
  );

assert.equal(
  invalidKey.code,
  "INVALID_API_KEY"
);

assert.equal(
  authenticate(
    "test-secret"
  ),
  "allowed"
);

console.log(
  "API key authentication tests passed."
);
