// ======================================================
// Execution Records Schema
// ======================================================

const REQUIRED_COLUMNS =
  Object.freeze({
    request_snapshot:
      "TEXT",
  });

// ======================================================
// Column Helpers
// ======================================================

function getExistingColumns(db) {
  const columns =
    db
      .prepare(
        "PRAGMA table_info(execution_records)"
      )
      .all();

  return new Set(
    columns.map(
      (column) =>
        column.name
    )
  );
}

function addMissingColumns(db) {
  const existingColumns =
    getExistingColumns(
      db
    );

  for (
    const [
      name,
      type,
    ] of Object.entries(
      REQUIRED_COLUMNS
    )
  ) {
    if (
      !existingColumns.has(
        name
      )
    ) {
      db.exec(`
        ALTER TABLE execution_records
        ADD COLUMN ${name} ${type}
      `);
    }
  }
}

// ======================================================
// Initialization
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

      request_snapshot TEXT,

      error TEXT,

      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  addMissingColumns(
    db
  );
}

module.exports = {
  initializeExecutionRecordsSchema,
};