// ======================================================
// Execute AI Stage
// ======================================================

const aiRunner = require("../../aiRunner");

async function execute(context) {
  context.aiExecution =
    await aiRunner.runAIWithMetadata({
      workflow: context.workflow,
      endpoint: context.endpoint,
      provider: context.route?.provider,
      model: context.route?.model,
      prompt: context.prompt?.prompt,
    });

  return context;
}

module.exports = {
  name: "execute-ai",
  execute,
};