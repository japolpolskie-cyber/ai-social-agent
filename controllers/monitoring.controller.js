// ======================================================
// Monitoring Controller
// ======================================================

const responseService = require(
  "../services/responseService"
);

const monitoringService = require(
  "../services/monitoring/monitoringService"
);

// ======================================================
// Get Monitoring Snapshot
// ======================================================

async function getMonitoring(
  req,
  res
) {
  try {
    const monitoring =
      await monitoringService
        .getMonitoringSnapshot();

    return responseService.success(
      res,
      monitoring
    );
  } catch (error) {
    return responseService.error(
      res,
      error,
      error.statusCode ||
      500
    );
  }
}

module.exports = {
  getMonitoring,
};