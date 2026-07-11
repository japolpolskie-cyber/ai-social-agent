// ======================================================
// Execution History
// ======================================================

function normalizeInteger(
  value,
  fallback = 0
) {
  return (
    Number.isInteger(value) &&
    value >= 0
  )
    ? value
    : fallback;
}

function createExecutionHistory({
  executions = [],
  total = 0,
  limit = null,
  offset = 0,
} = {}) {
  if (!Array.isArray(executions)) {
    throw new TypeError(
      "Execution history requires an executions array."
    );
  }

  const normalizedTotal =
    normalizeInteger(
      total,
      executions.length
    );

  const normalizedOffset =
    normalizeInteger(
      offset,
      0
    );

  const normalizedLimit =
    Number.isInteger(limit) &&
    limit > 0
      ? limit
      : null;

  const count =
    executions.length;

  return Object.freeze({
    total:
      normalizedTotal,

    count,

    limit:
      normalizedLimit,

    offset:
      normalizedOffset,

    hasMore:
      normalizedOffset + count <
      normalizedTotal,

    executions:
      Object.freeze([
        ...executions,
      ]),
  });
}

module.exports = {
  createExecutionHistory,
};