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
    request?.configuration
      ?.executionId ||
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

function resolveAIState(context) {
  if (
    context.ai &&
    typeof context.ai.snapshot ===
      "function"
  ) {
    return context.ai.snapshot();
  }

  return {};
}

function resolveMetadata(
  context,
  request
) {
  const ai =
    resolveAIState(
      context
    );

  const provider =
    ai.execution?.provider ||
    ai.route?.provider ||
    null;

  const model =
    ai.execution?.model ||
    ai.route?.model ||
    null;

  const routeSource =
    ai.route?.source ||
    null;

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

    ...(context.workflow
      ? {
          workflow:
            context.workflow,
        }
      : {}),

    ...(provider
      ? {
          provider,
        }
      : {}),

    ...(model
      ? {
          model,
        }
      : {}),

    ...(routeSource
      ? {
          routeSource,
        }
      : {}),
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