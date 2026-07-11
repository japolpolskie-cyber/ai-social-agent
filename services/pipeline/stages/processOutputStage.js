// ======================================================
// Process Output Stage
// ======================================================

const {
  processOutput,
} = require(
  "../../outputProcessor"
);

async function execute(context) {
  const ai =
    context.ai.snapshot();

  const processed =
    await processOutput({
      output:
        ai.execution?.output,

      rules:
        ai.contentContext?.rules ||
        {},

      context:
        ai.contentContext ||
        {},

      provider:
        ai.execution?.provider ||
        ai.route?.provider,

      model:
        ai.execution?.model ||
        ai.route?.model,

      workflow:
        context.workflow,

      endpoint:
        context.endpoint,
    });

  context.ai.setProcessed(
    processed
  );

  return context;
}

module.exports = {
  name:
    "process-output",

  execute,
};