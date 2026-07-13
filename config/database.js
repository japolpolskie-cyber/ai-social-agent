// ======================================================
// Database Configuration
// ======================================================

const path = require(
  "node:path"
);

const defaultDatabaseFile =
  path.resolve(
    __dirname,
    "..",
    "database",
    "ai-social-agent.db"
  );

module.exports = Object.freeze({
  file:
    process.env.DB_FILE
      ? path.resolve(
          process.env.DB_FILE
        )
      : defaultDatabaseFile,
});
