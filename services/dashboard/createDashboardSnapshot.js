// ======================================================
// Dashboard Snapshot
// ======================================================

function createDashboardSnapshot({
  monitoring,
  recentExecutions,
  pipelines,
}) {
  return Object.freeze({
    overview: {
      status:
        monitoring.system.status,

      service:
        monitoring.system.service,

      version:
        monitoring.system.version,

      environment:
        monitoring.system.environment,
    },

    monitoring,

    recentExecutions,

    pipelines,
  });
}

module.exports = {
  createDashboardSnapshot,
};