// ======================================================
// Build Prompt Stage
// ======================================================

const promptBuilder = require("../../promptBuilder");

function execute(context) {
  context.prompt = promptBuilder.build(
    context.contentContext
  );

  return context;
}

module.exports = {
  execute,
};