// ======================================================
// AI Context Builder
// ======================================================

function assertFunction(
  value,
  name
) {
  if (typeof value !== "function") {
    throw new TypeError(
      `AI context requires "${name}"().`
    );
  }

  return value;
}

function createAIContext(api = {}) {
  return Object.freeze({
    setContentContext:
      assertFunction(
        api.setContentContext,
        "setContentContext"
      ),

    setRoute:
      assertFunction(
        api.setRoute,
        "setRoute"
      ),

    setPrompt:
      assertFunction(
        api.setPrompt,
        "setPrompt"
      ),

    setExecution:
      assertFunction(
        api.setExecution,
        "setExecution"
      ),

    setProcessed:
      assertFunction(
        api.setProcessed,
        "setProcessed"
      ),

    snapshot:
      assertFunction(
        api.snapshot,
        "snapshot"
      ),
  });
}

module.exports = {
  createAIContext,
};