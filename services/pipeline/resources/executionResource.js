// ======================================================
// Execution Resource
// ======================================================

function cloneObject(
  value
) {
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

function cloneNullableObject(
  value
) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return null;
  }

  return {
    ...value,
  };
}

function createExecutionResource(
  execution
) {
  if (
    !execution ||
    typeof execution !== "object" ||
    Array.isArray(execution)
  ) {
    throw new TypeError(
      "Execution resource requires a valid execution record."
    );
  }

  return Object.freeze({
    executionId:
      execution.executionId,

    pipeline:
      execution.pipeline,

    pipelineVersion:
      execution.pipelineVersion,

    status:
      execution.status,

    endpoint:
      execution.endpoint,

    startedAt:
      execution.startedAt,

    completedAt:
      execution.completedAt,

    duration:
      execution.duration,

    completedStages:
      Object.freeze([
        ...(
          execution.completedStages ||
          []
        ),
      ]),

    stageMetrics:
      Object.freeze(
        (
          execution.stageMetrics ||
          []
        ).map(
          (metric) =>
            Object.freeze({
              ...metric,
            })
        )
      ),

    metadata:
      Object.freeze(
        cloneObject(
          execution.metadata
        )
      ),

    requestSnapshot:
      execution.requestSnapshot
        ? Object.freeze(
            cloneNullableObject(
              execution.requestSnapshot
            )
          )
        : null,

    error:
      execution.error
        ? Object.freeze({
            ...execution.error,
          })
        : null,
  });
}

module.exports = {
  createExecutionResource,
};