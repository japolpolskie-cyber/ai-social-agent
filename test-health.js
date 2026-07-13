// ======================================================
// Health Service Tests
// ======================================================

const assert = require(
  "node:assert/strict"
);

const {
  checkDatabase,
  getHealthStatus,
} = require(
  "./services/healthService"
);

const healthyDatabase = {
  prepare(sql) {
    assert.equal(
      sql,
      "SELECT 1 AS healthy"
    );

    return {
      get() {
        return {
          healthy: 1,
        };
      },
    };
  },
};

assert.deepEqual(
  checkDatabase(
    healthyDatabase
  ),
  {
    healthy: true,
    status: "connected",
  }
);

assert.deepEqual(
  checkDatabase({
    prepare() {
      throw new Error(
        "database unavailable"
      );
    },
  }),
  {
    healthy: false,
    status: "unavailable",
  }
);

const health =
  getHealthStatus({
    database:
      healthyDatabase,

    now: () =>
      "2026-07-13T00:00:00.000Z",
  });

assert.equal(
  health.healthy,
  true
);

assert.equal(
  health.database,
  "connected"
);

assert.equal(
  health.timestamp,
  "2026-07-13T00:00:00.000Z"
);

console.log(
  "Health service tests passed."
);
