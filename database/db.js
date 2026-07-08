const Database = require('better-sqlite3');

const db = new Database('./database/ai-social-agent.db');

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

const columns = db.prepare(`PRAGMA table_info(runs)`).all();
const columnNames = columns.map(col => col.name);

const requiredColumns = {
  endpoint: 'TEXT',
  provider: 'TEXT',
  prompt: 'TEXT',
  response: 'TEXT',
  model: 'TEXT',
  execution_time: 'INTEGER'
};

for (const [column, type] of Object.entries(requiredColumns)) {
  if (!columnNames.includes(column)) {
    db.exec(`ALTER TABLE runs ADD COLUMN ${column} ${type}`);
  }
}

module.exports = db;