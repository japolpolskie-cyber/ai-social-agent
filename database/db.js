// ======================================================
// Database Connection
// ======================================================

const Database = require(
  "better-sqlite3"
);

const {
  initializeDatabase,
} = require(
  "./initializeDatabase"
);

const db = new Database(
  "./database/ai-social-agent.db"
);

initializeDatabase(
  db
);

module.exports = db;