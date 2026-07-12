// ======================================================
// Dashboard Controller
// ======================================================

const responseService = require(
  "../services/responseService"
);

const dashboardService = require(
  "../services/dashboard/dashboardService"
);

async function getDashboard(
  req,
  res
) {

  const dashboard =
    await dashboardService
      .getDashboard();

  return responseService.success(
    res,
    dashboard
  );

}

module.exports = {
  getDashboard,
};