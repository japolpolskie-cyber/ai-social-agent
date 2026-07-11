// ======================================================
// Build Context Stage
// ======================================================

const contextBuilder = require(
  "../../contextBuilder"
);

function execute(context) {
  const contentContext =
    contextBuilder.build(
      context.input
    );

  context.ai.setContentContext(
    contentContext
  );

  return context;
}

module.exports = {
  name:
    "build-context",

  execute,
};