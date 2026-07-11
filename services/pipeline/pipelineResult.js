// ======================================================
// AI Pipeline Result
// ======================================================

function createPipelineResult(context) {
  const ai =
    context.ai.snapshot();

  return {
    workflow:
      context.workflow,

    endpoint:
      context.endpoint,

    routing: {
      provider:
        ai.execution?.provider ||
        ai.route?.provider,

      model:
        ai.execution?.model ||
        ai.route?.model,

      source:
        ai.route?.source,
    },

    template:
      ai.prompt?.template,

    output:
      ai.processed?.output,

    validation:
      ai.processed?.validation,

    repair:
      ai.processed?.repair,

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
        context.execution
          ?.completedStages ||
        [],

      stages:
        context.execution
          ?.stageMetrics ||
        [],
    },
  };
}

module.exports = {
  createPipelineResult,
};