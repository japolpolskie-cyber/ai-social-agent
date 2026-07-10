// ======================================================
// Build Context Stage
// ======================================================

const contextBuilder = require("../../contextBuilder");

function execute(context) {
  context.contentContext =
    contextBuilder.build(context.input);

  return context;
}

module.exports = {
  name: "build-context",
  execute,
};