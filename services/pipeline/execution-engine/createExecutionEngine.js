// ======================================================
// Execution Engine Builder
// ======================================================

function assertFunction(
  value,
  name
) {
  if (typeof value !== "function") {
    throw new TypeError(
      `Execution engine requires "${name}" function.`
    );
  }

  return value;
}

function createExecutionEngine({
  initializeExecution,
  startStage,
  completeStage,
  failStage,
  completeExecution,
  failExecution,
  getExecution,
} = {}) {
  return Object.freeze({
    initializeExecution:
      assertFunction(
        initializeExecution,
        "initializeExecution"
      ),

    startStage:
      assertFunction(
        startStage,
        "startStage"
      ),

    completeStage:
      assertFunction(
        completeStage,
        "completeStage"
      ),

    failStage:
      assertFunction(
        failStage,
        "failStage"
      ),

    completeExecution:
      assertFunction(
        completeExecution,
        "completeExecution"
      ),

    failExecution:
      assertFunction(
        failExecution,
        "failExecution"
      ),

    getExecution:
      assertFunction(
        getExecution,
        "getExecution"
      ),
  });
}

module.exports = {
  createExecutionEngine,
};