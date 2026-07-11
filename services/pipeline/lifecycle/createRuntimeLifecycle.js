// ======================================================
// Runtime Lifecycle Builder
// ======================================================

function assertFunction(
  value,
  name
) {
  if (typeof value !== "function") {
    throw new TypeError(
      `Runtime lifecycle requires "${name}" function.`
    );
  }

  return value;
}

function createRuntimeLifecycle({
  initialize,
  beforeExecution,
  execute,
  afterExecution,
  cleanup,
} = {}) {
  return Object.freeze({
    initialize:
      assertFunction(
        initialize,
        "initialize"
      ),

    beforeExecution:
      assertFunction(
        beforeExecution,
        "beforeExecution"
      ),

    execute:
      assertFunction(
        execute,
        "execute"
      ),

    afterExecution:
      assertFunction(
        afterExecution,
        "afterExecution"
      ),

    cleanup:
      assertFunction(
        cleanup,
        "cleanup"
      ),
  });
}

module.exports = {
  createRuntimeLifecycle,
};