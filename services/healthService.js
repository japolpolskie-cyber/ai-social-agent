// ======================================================
// Health Service
// ======================================================

const appConfig = require(
  "../config/app"
);

const environment = require(
  "../config/environment"
);

const db = require(
  "../database/db"
);

function checkDatabase(
  database = db
) {
  try {
    const result = database
      .prepare(
        "SELECT 1 AS healthy"
      )
      .get();

    return {
      healthy:
        result?.healthy === 1,

      status:
        result?.healthy === 1
          ? "connected"
          : "unavailable",
    };
  } catch (error) {
    return {
      healthy: false,
      status: "unavailable",
    };
  }
}

function getHealthStatus({
  database = db,
  now = () =>
    new Date().toISOString(),
} = {}) {
  const databaseStatus =
    checkDatabase(
      database
    );

  return {
    healthy:
      databaseStatus.healthy,

    status:
      databaseStatus.healthy
        ? "ok"
        : "unavailable",

    service:
      appConfig.name,

    version:
      appConfig.version,

    database:
      databaseStatus.status,

    defaultProvider:
      environment
        .defaultProvider,

    timestamp:
      now(),
  };
}

module.exports = {
  checkDatabase,
  getHealthStatus,
};
