// ======================================================
// Pipeline Execution Record Builder
// ======================================================

const VALID_STATUSES =
  new Set([
    "success",
    "failed",
  ]);

// ======================================================
// Validation
// ======================================================

function assertNonEmptyString(
  value,
  field
) {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new TypeError(
      `Execution record requires a valid "${field}".`
    );
  }

  return value.trim();
}

function normalizeNullableString(
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
    throw new TypeError(
      `Execution record "${field}" must be a string or null.`
    );
  }

  const normalized =
    value.trim();

  return normalized || null;
}

function normalizeStatus(status) {
  if (!VALID_STATUSES.has(status)) {
    throw new TypeError(
      'Execution record status must be "success" or "failed".'
    );
  }

  return status;
}

function normalizeDuration(duration) {
  if (
    typeof duration !== "number" ||
    !Number.isFinite(duration) ||
    duration < 0
  ) {
    return 0;
  }

  return duration;
}

function normalizeArray(value) {
  return Array.isArray(value)
    ? [...value]
    : [];
}

function normalizeObject(value) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return {};
  }

  return {
    ...value,
  };
}

function normalizeNullableObject(value) {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  if (
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new TypeError(
      "Execution record requestSnapshot must be an object or null."
    );
  }

  return Object.freeze({
    ...value,
  });
}

function normalizeError(error) {
  if (!error) {
    return null;
  }

  if (
    typeof error.toJSON ===
    "function"
  ) {
    return Object.freeze({
      ...error.toJSON(),
    });
  }

  return Object.freeze({
    code:
      error.code ||
      "PIPELINE_EXECUTION_FAILED",

    message:
      error.message ||
      "Pipeline execution failed.",

    stage:
      error.stage ||
      null,
  });
}

// ======================================================
// Builder
// ======================================================

function createExecutionRecord({
  executionId,
  pipeline,
  pipelineVersion = null,
  status,
  endpoint = null,
  startedAt = null,
  completedAt = null,
  duration = 0,
  completedStages = [],
  stageMetrics = [],
  metadata = {},
  requestSnapshot = null,
  error = null,
} = {}) {
  const normalizedStages =
    normalizeArray(
      completedStages
    );

  const normalizedMetrics =
    normalizeArray(
      stageMetrics
    ).map(
      (metric) =>
        Object.freeze({
          ...metric,
        })
    );

  return Object.freeze({
    executionId:
      assertNonEmptyString(
        executionId,
        "executionId"
      ),

    pipeline:
      assertNonEmptyString(
        pipeline,
        "pipeline"
      ),

    pipelineVersion:
      normalizeNullableString(
        pipelineVersion,
        "pipelineVersion"
      ),

    status:
      normalizeStatus(
        status
      ),

    endpoint:
      normalizeNullableString(
        endpoint,
        "endpoint"
      ),

    startedAt:
      normalizeNullableString(
        startedAt,
        "startedAt"
      ),

    completedAt:
      normalizeNullableString(
        completedAt,
        "completedAt"
      ),

    duration:
      normalizeDuration(
        duration
      ),

    completedStages:
      Object.freeze(
        normalizedStages
      ),

    stageMetrics:
      Object.freeze(
        normalizedMetrics
      ),

    metadata:
      Object.freeze(
        normalizeObject(
          metadata
        )
      ),

    requestSnapshot:
      normalizeNullableObject(
        requestSnapshot
      ),

    error:
      normalizeError(
        error
      ),
  });
}

module.exports = {
  createExecutionRecord,
};