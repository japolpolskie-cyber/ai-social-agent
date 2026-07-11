// ======================================================
// Pipeline Runtime Builder
// ======================================================

function assertFunction(value, name) {
  if (typeof value !== "function") {
    throw new TypeError(
      `Pipeline runtime requires "${name}" function.`
    );
  }

  return value;
}

function createPipelineRuntime({
  createContext,
  initialize,
  beforeExecution,
  afterExecution,
  createResult,
  cleanup,
} = {}) {
  return Object.freeze({
    createContext: assertFunction(
      createContext,
      "createContext"
    ),

    initialize: assertFunction(
      initialize,
      "initialize"
    ),

    beforeExecution: assertFunction(
      beforeExecution,
      "beforeExecution"
    ),

    afterExecution: assertFunction(
      afterExecution,
      "afterExecution"
    ),

    createResult: assertFunction(
      createResult,
      "createResult"
    ),

    cleanup: assertFunction(
      cleanup,
      "cleanup"
    ),
  });
}

module.exports = {
  createPipelineRuntime,
};