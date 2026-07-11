// ======================================================
// Execution Collection Resource
// ======================================================

const {
  createExecutionResource,
} = require(
  "./executionResource"
);

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

function createExecutionCollectionResource({
  total = 0,
  count = null,
  limit = null,
  offset = 0,
  hasMore = false,
  executions = [],
  query = {},
} = {}) {
  if (!Array.isArray(executions)) {
    throw new TypeError(
      "Execution collection resource requires an executions array."
    );
  }

  const normalizedCount =
    count === null
      ? executions.length
      : normalizeInteger(
          count,
          executions.length
        );

  return Object.freeze({
    total:
      normalizeInteger(
        total,
        executions.length
      ),

    count:
      normalizedCount,

    limit:
      Number.isInteger(limit) &&
      limit > 0
        ? limit
        : null,

    offset:
      normalizeInteger(
        offset,
        0
      ),

    hasMore:
      Boolean(hasMore),

    query:
      Object.freeze({
        pipeline:
          query.pipeline ||
          null,

        status:
          query.status ||
          null,
      }),

    executions:
      Object.freeze(
        executions.map(
          createExecutionResource
        )
      ),
  });
}

module.exports = {
  createExecutionCollectionResource,
};