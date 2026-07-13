// ======================================================
// Database Connection
// ======================================================

const Database = require(
  "better-sqlite3"
);

const databaseConfig = require(
  "../config/database"
);

const {
  initializeDatabase,
} = require(
  "./initializeDatabase"
);

const db = new Database(
  databaseConfig.file
);

db.pragma(
  "foreign_keys = ON"
);

db.pragma(
  "busy_timeout = 5000"
);

db.pragma(
  "journal_mode = WAL"
);

initializeDatabase(
  db
);

module.exports = db;
