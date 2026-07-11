// ======================================================
// Pipeline Execution Store Builder
// ======================================================

function assertFunction(
  value,
  name
) {
  if (typeof value !== "function") {
    throw new TypeError(
      `Execution store requires "${name}"().`
    );
  }

  return value;
}

function createExecutionStore({
  save,
  get,
  has,
  list,
  count,
  remove,
  clear,
} = {}) {
  return Object.freeze({
    save:
      assertFunction(
        save,
        "save"
      ),

    get:
      assertFunction(
        get,
        "get"
      ),

    has:
      assertFunction(
        has,
        "has"
      ),

    list:
      assertFunction(
        list,
        "list"
      ),

    count:
      assertFunction(
        count,
        "count"
      ),

    remove:
      assertFunction(
        remove,
        "remove"
      ),

    clear:
      assertFunction(
        clear,
        "clear"
      ),
  });
}

module.exports = {
  createExecutionStore,
};