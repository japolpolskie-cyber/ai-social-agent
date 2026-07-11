// ======================================================
// Execution Analytics Service
// ======================================================

const executionStore = require(
  "../execution-store/executionStore"
);

const {
  createExecutionStatistics,
} = require(
  "./executionStatistics"
);

// ======================================================
// Analytics
// ======================================================

async function getExecutionStatistics(
  options = {}
) {
  const records =
    await executionStore.list({
      pipeline:
        options.pipeline,

      status:
        options.status,
    });

  return createExecutionStatistics(
    records
  );
}

module.exports = {
  getExecutionStatistics,
};