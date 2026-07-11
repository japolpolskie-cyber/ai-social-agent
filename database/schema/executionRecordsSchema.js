// ======================================================
// Execution Records Schema
// ======================================================

function initializeExecutionRecordsSchema(
  db
) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS execution_records (
      execution_id TEXT PRIMARY KEY,

      pipeline TEXT,

      pipeline_version TEXT,

      status TEXT,

      endpoint TEXT,

      started_at TEXT,

      completed_at TEXT,

      duration INTEGER,

      completed_stages TEXT,

      stage_metrics TEXT,

      metadata TEXT,

      error TEXT,

      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

module.exports = {
  initializeExecutionRecordsSchema,
};