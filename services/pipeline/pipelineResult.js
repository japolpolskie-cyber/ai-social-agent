// ======================================================
// AI Pipeline Result
// ======================================================

function createPipelineResult(context) {
  return {
    workflow:
      context.workflow,

    endpoint:
      context.endpoint,

    routing: {
      provider:
        context.aiExecution?.provider ||
        context.route?.provider,

      model:
        context.aiExecution?.model ||
        context.route?.model,

      source:
        context.route?.source,
    },

    template:
      context.prompt?.template,

    output:
      context.processed?.output,

    validation:
      context.processed?.validation,

    repair:
      context.processed?.repair,

    meta: {
      executionId:
        context.execution?.id ||
        context.metadata?.executionId ||
        null,

      executionMetadata: {
        ...(
          context.metadata?.execution ||
          {}
        ),
      },

      pipeline:
        context.execution?.pipeline,

      pipelineVersion:
        context.metadata?.pipelineVersion,

      startedAt:
        context.execution?.startedAt,

      completedAt:
        context.execution?.completedAt,

      duration:
        context.execution?.duration ||
        0,

      completedStages:
        context.execution?.completedStages ||
        [],

      stages:
        context.execution?.stageMetrics ||
        [],
    },
  };
}

module.exports = {
  createPipelineResult,
};