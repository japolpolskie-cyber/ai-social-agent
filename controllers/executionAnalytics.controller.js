// ======================================================
// Execution Analytics Controller
// ======================================================

const responseService = require(
  "../services/responseService"
);

const executionAnalyticsService =
  require(
    "../services/pipeline/analytics/executionAnalyticsService"
  );

// ======================================================
// Get Statistics
// ======================================================

async function getStatistics(
  req,
  res
) {
  try {
    const stats =
      await executionAnalyticsService
        .getExecutionStatistics({
          pipeline:
            req.query.pipeline,

          status:
            req.query.status,
        });

    return responseService.success(
      res,
      {
        stats,
      }
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
  getStatistics,
};