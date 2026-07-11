// ======================================================
// Runs Schema
// ======================================================

const REQUIRED_COLUMNS = {
  endpoint: "TEXT",
  provider: "TEXT",
  prompt: "TEXT",
  response: "TEXT",
  model: "TEXT",
  execution_time: "INTEGER",
};

function initializeRunsSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workflow TEXT,
      endpoint TEXT,
      provider TEXT,
      prompt TEXT,
      response TEXT,
      model TEXT,
      status TEXT,
      execution_time INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const columns = db
    .prepare(
      `PRAGMA table_info(runs)`
    )
    .all();

  const existingColumns =
    new Set(
      columns.map(
        (column) =>
          column.name
      )
    );

  for (const [
    name,
    type,
  ] of Object.entries(
    REQUIRED_COLUMNS
  )) {
    if (
      !existingColumns.has(
        name
      )
    ) {
      db.exec(`
        ALTER TABLE runs
        ADD COLUMN ${name} ${type}
      `);
    }
  }
}

module.exports = {
  initializeRunsSchema,
};