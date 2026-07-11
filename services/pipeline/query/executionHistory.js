// ======================================================
// Execution History
// ======================================================

function createExecutionHistory({
  executions = [],
  total = 0,
} = {}) {
  return Object.freeze({
    total,

    executions: Object.freeze(
      [...executions]
    ),
  });
}

module.exports = {
  createExecutionHistory,
};