// ======================================================
// Execution Summary
// ======================================================

function createExecutionSummary(
  record
) {
  return Object.freeze({
    executionId:
      record.executionId,

    pipeline:
      record.pipeline,

    status:
      record.status,

    duration:
      record.duration,

    startedAt:
      record.startedAt,

    completedAt:
      record.completedAt,
  });
}

module.exports = {
  createExecutionSummary,
};