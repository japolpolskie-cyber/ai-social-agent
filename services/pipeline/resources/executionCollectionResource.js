// ======================================================
// Execution Collection Resource
// ======================================================

const {
  createExecutionResource,
} = require(
  "./executionResource"
);

function createExecutionCollectionResource({
  total = 0,
  executions = [],
  query = {},
} = {}) {
  if (!Array.isArray(executions)) {
    throw new TypeError(
      "Execution collection resource requires an executions array."
    );
  }

  return Object.freeze({
    total:
      Number.isInteger(total) &&
      total >= 0
        ? total
        : executions.length,

    query:
      Object.freeze({
        pipeline:
          query.pipeline ||
          null,

        status:
          query.status ||
          null,

        limit:
          Number.isInteger(
            query.limit
          )
            ? query.limit
            : null,

        offset:
          Number.isInteger(
            query.offset
          )
            ? query.offset
            : 0,
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