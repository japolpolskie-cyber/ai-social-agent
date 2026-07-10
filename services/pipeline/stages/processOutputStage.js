// ======================================================
// Process Output Stage
// ======================================================

const {
  processOutput,
} = require("../../outputProcessor");

async function execute(context) {
  context.processed = await processOutput({
    output: context.aiExecution?.output,

    rules:
      context.contentContext?.rules || {},

    context:
      context.contentContext || {},

    provider:
      context.aiExecution?.provider ||
      context.route?.provider,

    model:
      context.aiExecution?.model ||
      context.route?.model,

    workflow: context.workflow,
    endpoint: context.endpoint,
  });

  return context;
}

module.exports = {
  name: "process-output",
  execute,
};