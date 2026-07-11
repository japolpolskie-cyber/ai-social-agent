// ======================================================
// Pipeline Execution Request
// ======================================================

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
  field,
  defaultValue = {}
) {
  if (
    value === undefined ||
    value === null
  ) {
    return defaultValue;
  }

  if (!isPlainObject(value)) {
    throw new PipelineError({
      code:
        "PIPELINE_EXECUTION_REQUEST_INVALID",

      message:
        `Pipeline execution "${field}" ` +
        "must be an object.",

      stage:
        "pipeline-execution-request",

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

function normalizeRequiredName(value) {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new PipelineError({
      code:
        "PIPELINE_NAME_INVALID",

      message:
        "Pipeline execution requires a valid pipeline name.",

      stage:
        "pipeline-execution-request",

      statusCode: 400,

      details: {
        field: "pipelineName",
      },
    });
  }

  return value.trim();
}

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
        "PIPELINE_EXECUTION_REQUEST_INVALID",

      message:
        `Pipeline execution "${field}" ` +
        "must be a string.",

      stage:
        "pipeline-execution-request",

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
// Options
// ======================================================

function normalizeOptions(options) {
  const normalizedOptions =
    normalizeObject(
      options,
      "options"
    );

  const metadata =
    normalizeObject(
      normalizedOptions.metadata,
      "options.metadata"
    );

  return Object.freeze({
    executionId:
      normalizeOptionalString(
        normalizedOptions.executionId,
        "options.executionId"
      ),

    metadata:
      Object.freeze({
        ...metadata,
      }),
  });
}

// ======================================================
// Factory
// ======================================================

function createPipelineExecutionRequest({
  pipelineName,
  input = {},
  endpoint = null,
  options = {},
} = {}) {
  const normalizedInput =
    normalizeObject(
      input,
      "input"
    );

  return Object.freeze({
    pipelineName:
      normalizeRequiredName(
        pipelineName
      ),

    input:
      Object.freeze({
        ...normalizedInput,
      }),

    endpoint:
      normalizeOptionalString(
        endpoint,
        "endpoint"
      ),

    options:
      normalizeOptions(options),
  });
}

module.exports = {
  createPipelineExecutionRequest,
};