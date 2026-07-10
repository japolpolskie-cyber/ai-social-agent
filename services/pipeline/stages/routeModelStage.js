// ======================================================
// Route Model Stage
// ======================================================

const modelRouter = require("../../modelRouter");

function execute(context) {
  context.route = modelRouter.route(
    context.contentContext
  );

  return context;
}

module.exports = {
  execute,
};