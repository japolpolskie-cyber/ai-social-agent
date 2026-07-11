// ======================================================
// Pipeline Execution Record
// ======================================================

const {
  createExecutionRecord,
} = require(
  "./createExecutionRecord"
);

// ======================================================
// Resolution Helpers
// ======================================================

function resolveExecutionId(
  context,
  request
) {
  return (
    context.execution?.id ||
    context.metadata?.executionId ||
    request?.configuration?.executionId ||
    null
  );
}

function resolvePipelineName(
  context,
  resolution
) {
  return (
    context.execution?.pipeline ||
    resolution?.resolvedPipeline ||
    context.metadata?.pipeline
      ?.resolvedName ||
    null
  );
}

function resolvePipelineVersion(
  context,
  resolution
) {
  return (
    context.metadata
      ?.pipelineVersion ||
    resolution?.definition?.version ||
    null
  );
}

function resolveMetadata(
  context,
  request
) {
  return {
    ...(
      request?.configuration
        ?.metadata ||
      {}
    ),

    ...(
      context.metadata?.execution ||
      {}
    ),
  };
}

// ======================================================
// Factory
// ======================================================

function createPipelineExecutionRecord({
  context,
  request,
  resolution,
  error = null,
} = {}) {
  if (
    !context ||
    typeof context !== "object" ||
    Array.isArray(context)
  ) {
    throw new TypeError(
      "Pipeline execution record requires a valid context."
    );
  }

  const execution =
    context.execution ||
    {};

  return createExecutionRecord({
    executionId:
      resolveExecutionId(
        context,
        request
      ),

    pipeline:
      resolvePipelineName(
        context,
        resolution
      ),

    pipelineVersion:
      resolvePipelineVersion(
        context,
        resolution
      ),

    status:
      error
        ? "failed"
        : "success",

    endpoint:
      context.endpoint ||
      request?.endpoint ||
      null,

    startedAt:
      execution.startedAt ||
      null,

    completedAt:
      execution.completedAt ||
      null,

    duration:
      execution.duration ||
      0,

    completedStages:
      execution.completedStages ||
      [],

    stageMetrics:
      execution.stageMetrics ||
      [],

    metadata:
      resolveMetadata(
        context,
        request
      ),

    error,
  });
}

module.exports = {
  createPipelineExecutionRecord,
};