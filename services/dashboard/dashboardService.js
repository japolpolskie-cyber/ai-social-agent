// ======================================================
// Dashboard Service
// ======================================================

const monitoringService = require(
  "../monitoring/monitoringService"
);

const executionQueryService = require(
  "../pipeline/query/executionQueryService"
);

const pipelineDiscoveryService = require(
  "../pipeline/pipelineDiscoveryService"
);

const {
  createDashboardSnapshot,
} = require(
  "./createDashboardSnapshot"
);

async function getDashboard() {

  const monitoring =
    await monitoringService
      .getMonitoringSnapshot();

  const history =
    await executionQueryService
      .getExecutionHistory({
        limit: 5,
      });

  const pipelines =
    pipelineDiscoveryService
      .getAllPipelines();

  return createDashboardSnapshot({

    monitoring,

    recentExecutions:
      history.executions,

    pipelines,

  });

}

module.exports = {
  getDashboard,
};