// ======================================================
// Database Initialization
// ======================================================

const {
  initializeRunsSchema,
} = require(
  "./schema/runsSchema"
);

const {
  initializeExecutionRecordsSchema,
} = require(
  "./schema/executionRecordsSchema"
);

function initializeDatabase(
  db
) {
  initializeRunsSchema(
    db
  );

  initializeExecutionRecordsSchema(
    db
  );

  return db;
}

module.exports = {
  initializeDatabase,
};