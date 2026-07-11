// ======================================================
// Execution Query Service
// ======================================================

const executionStore = require(
  "../execution-store/executionStore"
);

const {
  createExecutionHistory,
} = require(
  "./executionHistory"
);

const {
  createExecutionSummary,
} = require(
  "./executionSummary"
);

// ======================================================
// Query Options
// ======================================================

function normalizeQueryOptions(
  options = {}
) {
  return {
    pipeline:
      typeof options.pipeline ===
      "string"
        ? options.pipeline.trim()
        : undefined,

    status:
      typeof options.status ===
      "string"
        ? options.status.trim()
        : undefined,

    limit:
      Number.isInteger(options.limit)
        ? options.limit
        : undefined,

    offset:
      Number.isInteger(options.offset)
        ? options.offset
        : undefined,
  };
}

// ======================================================
// Get Execution
// ======================================================

async function getExecution(
  executionId
) {
  return executionStore.get(
    executionId
  );
}

// ======================================================
// Execution History
// ======================================================

async function getExecutionHistory(
  options = {}
) {
  const queryOptions =
    normalizeQueryOptions(
      options
    );

  const executions =
    await executionStore.list(
      queryOptions
    );

  return createExecutionHistory({
    total:
      executions.length,

    executions:
      executions.map(
        createExecutionSummary
      ),
  });
}

// ======================================================
// Count
// ======================================================

async function countExecutions() {
  return executionStore.count();
}

module.exports = {
  getExecution,
  getExecutionHistory,
  countExecutions,
};