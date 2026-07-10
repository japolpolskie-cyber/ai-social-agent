// ======================================================
// AI Pipeline Result
// ======================================================

function createPipelineResult(context) {
  return {
    workflow: context.workflow,
    endpoint: context.endpoint,

    routing: {
      provider:
        context.execution?.provider ||
        context.route?.provider,

      model:
        context.execution?.model ||
        context.route?.model,

      source: context.route?.source,
    },

    template: context.prompt?.template,

    output: context.processed?.output,

    validation: context.processed?.validation,

    repair: context.processed?.repair,
  };
}

module.exports = {
  createPipelineResult,
};