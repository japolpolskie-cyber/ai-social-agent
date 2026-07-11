// ======================================================
// Execute AI Stage
// ======================================================

const aiRunner = require(
  "../../aiRunner"
);

async function execute(context) {
  const ai =
    context.ai.snapshot();

  const aiExecution =
    await aiRunner.runAIWithMetadata({
      workflow:
        context.workflow,

      endpoint:
        context.endpoint,

      provider:
        ai.route?.provider,

      model:
        ai.route?.model,

      prompt:
        ai.prompt?.prompt,
    });

  context.ai.setExecution(
    aiExecution
  );

  return context;
}

module.exports = {
  name:
    "execute-ai",

  execute,
};