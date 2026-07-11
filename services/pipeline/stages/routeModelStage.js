// ======================================================
// Route Model Stage
// ======================================================

const modelRouter = require(
  "../../modelRouter"
);

function execute(context) {
  const ai =
    context.ai.snapshot();

  const route =
    modelRouter.route(
      ai.contentContext
    );

  context.ai.setRoute(
    route
  );

  return context;
}

module.exports = {
  name:
    "route-model",

  execute,
};