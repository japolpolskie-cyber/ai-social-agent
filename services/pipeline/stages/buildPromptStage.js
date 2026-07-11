// ======================================================
// Build Prompt Stage
// ======================================================

const promptBuilder = require(
  "../../promptBuilder"
);

function execute(context) {
  const ai =
    context.ai.snapshot();

  const prompt =
    promptBuilder.build(
      ai.contentContext
    );

  context.ai.setPrompt(
    prompt
  );

  return context;
}

module.exports = {
  name:
    "build-prompt",

  execute,
};