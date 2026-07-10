// ======================================================
// Process Output Stage
// ======================================================

const {
  processOutput,
} = require("../../outputProcessor");

async function execute(context) {
  context.processed = await processOutput({
    output: context.execution?.output,
    rules: context.contentContext?.rules || {},
    context: context.contentContext || {},
    provider:
      context.execution?.provider ||
      context.route?.provider,
    model:
      context.execution?.model ||
      context.route?.model,
    workflow: context.workflow,
    endpoint: context.endpoint,
  });

  return context;
}

module.exports = {
  execute,
};