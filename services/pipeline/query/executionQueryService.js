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

function normalizeOptionalString(
  value
) {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized =
    value.trim();

  return normalized || undefined;
}

function normalizeLimit(value) {
  return (
    Number.isInteger(value) &&
    value > 0
  )
    ? value
    : undefined;
}

function normalizeOffset(value) {
  return (
    Number.isInteger(value) &&
    value >= 0
  )
    ? value
    : 0;
}

function normalizeQueryOptions(
  options = {}
) {
  return {
    pipeline:
      normalizeOptionalString(
        options.pipeline
      ),

    status:
      normalizeOptionalString(
        options.status
      ),

    limit:
      normalizeLimit(
        options.limit
      ),

    offset:
      normalizeOffset(
        options.offset
      ),
  };
}

function createCountOptions(
  queryOptions
) {
  return {
    pipeline:
      queryOptions.pipeline,

    status:
      queryOptions.status,
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

  const [
    executions,
    total,
  ] = await Promise.all([
    executionStore.list(
      queryOptions
    ),

    executionStore.count(
      createCountOptions(
        queryOptions
      )
    ),
  ]);

  return createExecutionHistory({
    total,

    executions:
      executions.map(
        createExecutionSummary
      ),

    limit:
      queryOptions.limit ||
      null,

    offset:
      queryOptions.offset,
  });
}

// ======================================================
// Count
// ======================================================

async function countExecutions(
  options = {}
) {
  const queryOptions =
    normalizeQueryOptions(
      options
    );

  return executionStore.count(
    createCountOptions(
      queryOptions
    )
  );
}

module.exports = {
  getExecution,
  getExecutionHistory,
  countExecutions,
};