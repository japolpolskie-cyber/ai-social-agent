// ======================================================
// Shared Pipeline Execution Store
// ======================================================

const {
  createMemoryExecutionStore,
} = require(
  "./memoryExecutionStore"
);

const {
  createSQLiteExecutionStore,
} = require(
  "./sqliteExecutionStore"
);

// ======================================================
// Default Store
// ======================================================

const DEFAULT_STORE =
  (
    process.env
      .EXECUTION_STORE ||
    "sqlite"
  ).toLowerCase();

function createDefaultStore() {
  switch (
    DEFAULT_STORE
  ) {
    case "memory":
      return createMemoryExecutionStore();

    case "sqlite":
      return createSQLiteExecutionStore();

    default:
      throw new Error(
        `Unsupported execution store: ${DEFAULT_STORE}`
      );
  }
}

let activeStore =
  createDefaultStore();

// ======================================================
// Store Validation
// ======================================================

function validateStore(store) {
  if (
    !store ||
    typeof store !== "object"
  ) {
    throw new TypeError(
      "A valid execution store is required."
    );
  }

  const requiredMethods = [
    "save",
    "get",
    "has",
    "list",
    "count",
    "remove",
    "clear",
  ];

  requiredMethods.forEach(
    (method) => {
      if (
        typeof store[method] !==
        "function"
      ) {
        throw new TypeError(
          `Execution store must provide "${method}"().`
        );
      }
    }
  );

  return store;
}

// ======================================================
// Configuration
// ======================================================

function configureExecutionStore(
  store
) {
  activeStore =
    validateStore(
      store
    );

  return activeStore;
}

function resetExecutionStore() {
  activeStore =
    createMemoryExecutionStore();

  return activeStore;
}

function getExecutionStore() {
  return activeStore;
}

// ======================================================
// Delegated Operations
// ======================================================

async function save(record) {
  return activeStore.save(
    record
  );
}

async function get(executionId) {
  return activeStore.get(
    executionId
  );
}

async function has(executionId) {
  return activeStore.has(
    executionId
  );
}

async function list(options = {}) {
  return activeStore.list(
    options
  );
}

async function count() {
  return activeStore.count();
}

async function remove(executionId) {
  return activeStore.remove(
    executionId
  );
}

async function clear() {
  return activeStore.clear();
}

module.exports = {
  configureExecutionStore,
  resetExecutionStore,
  getExecutionStore,

  save,
  get,
  has,
  list,
  count,
  remove,
  clear,
};