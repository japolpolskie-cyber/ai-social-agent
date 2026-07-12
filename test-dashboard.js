// ======================================================
// Dashboard Test
// ======================================================

const assert = require(
  "node:assert"
);

const dashboardService =
  require(
    "./services/dashboard/dashboardService"
  );

async function run() {

  const dashboard =
    await dashboardService
      .getDashboard();

  assert.ok(
    dashboard.overview
  );

  assert.ok(
    dashboard.monitoring
  );

  assert.ok(
    dashboard.recentExecutions
  );

  assert.ok(
    dashboard.pipelines
  );

  console.log(
    "Dashboard tests passed."
  );

}

run().catch((error) => {

  console.error(error);

  process.exit(1);

});