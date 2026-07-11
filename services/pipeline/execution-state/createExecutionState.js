// ======================================================
// Execution State Builder
// ======================================================

function createExecutionState(api = {}) {
  const required = [
    "initialize",
    "startStage",
    "completeStage",
    "failStage",
    "completeExecution",
    "failExecution",
    "snapshot",
  ];

  required.forEach((name) => {
    if (typeof api[name] !== "function") {
      throw new TypeError(
        `Execution state requires "${name}"().`
      );
    }
  });

  return Object.freeze(api);
}

module.exports = {
  createExecutionState,
};