// ======================================================
// Response Service Tests
// ======================================================

const assert = require(
  "node:assert/strict"
);

const {
  createPublicError,
} = require(
  "./services/responseService"
);

const internalError = {
  code:
    "DATABASE_QUERY_FAILED",

  message:
    "Sensitive database details",

  details: {
    query:
      "SELECT secret FROM credentials",
  },
};

assert.deepEqual(
  createPublicError(
    internalError,
    500,
    "production"
  ),
  {
    code:
      "INTERNAL_SERVER_ERROR",

    message:
      "Internal server error",
  }
);

assert.deepEqual(
  createPublicError(
    {
      code:
        "INVALID_REQUEST",

      message:
        "Topic is required",
    },
    400,
    "production"
  ),
  {
    code:
      "INVALID_REQUEST",

    message:
      "Topic is required",
  }
);

assert.deepEqual(
  createPublicError(
    internalError,
    500,
    "development"
  ),
  internalError
);

console.log(
  "Response service tests passed."
);
