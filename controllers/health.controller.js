const responseService = require('../services/responseService');

const healthService = require(
  '../services/healthService'
);

function health(req, res) {
  const status =
    healthService
      .getHealthStatus();

  if (
    status.healthy
  ) {
    return responseService.success(
      res,
      status
    );
  }

  return res
    .status(
      503
    )
    .json({
      success: false,
      ...status,
    });
}

module.exports = {
  health,
};
