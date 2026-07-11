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
  const executions =
    await executionStore.list(
      options
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