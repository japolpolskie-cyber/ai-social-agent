// ======================================================
// Pipeline Execution Configuration
// ======================================================

const {
  randomUUID,
} = require("crypto");

const PipelineError = require(
  "../pipelineError"
);

// ======================================================
// Object Validation
// ======================================================

function isPlainObject(value) {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return false;
  }

  const prototype =
    Object.getPrototypeOf(value);

  return (
    prototype === Object.prototype ||
    prototype === null
  );
}

function normalizeObject(
  value,
  field
) {
  if (
    value === undefined ||
    value === null
  ) {
    return {};
  }

  if (!isPlainObject(value)) {
    throw new PipelineError({
      code:
        "PIPELINE_EXECUTION_CONFIG_INVALID",

      message:
        `Pipeline execution configuration "${field}" ` +
        "must be an object.",

      stage:
        "pipeline-execution-config",

      statusCode: 400,

      details: {
        field,
      },
    });
  }

  return value;
}

// ======================================================
// String Normalization
// ======================================================

function normalizeOptionalString(
  value,
  field
) {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  if (typeof value !== "string") {
    throw new PipelineError({
      code:
        "PIPELINE_EXECUTION_CONFIG_INVALID",

      message:
        `Pipeline execution configuration "${field}" ` +
        "must be a string.",

      stage:
        "pipeline-execution-config",

      statusCode: 400,

      details: {
        field,
      },
    });
  }

  const normalized =
    value.trim();

  return normalized || null;
}

// ======================================================
// Execution ID
// ======================================================

function resolveExecutionId(value) {
  return (
    normalizeOptionalString(
      value,
      "executionId"
    ) ||
    randomUUID()
  );
}

// ======================================================
// Factory
// ======================================================

function createPipelineExecutionConfig({
  executionId = null,
  metadata = {},
} = {}) {
  const normalizedMetadata =
    normalizeObject(
      metadata,
      "metadata"
    );

  return Object.freeze({
    executionId:
      resolveExecutionId(
        executionId
      ),

    metadata:
      Object.freeze({
        ...normalizedMetadata,
      }),
  });
}

module.exports = {
  createPipelineExecutionConfig,
};