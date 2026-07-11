// ======================================================
// Execution Analytics Routes
// ======================================================

const express = require(
  "express"
);

const router =
  express.Router();

const executionAnalyticsController =
  require(
    "../controllers/executionAnalytics.controller"
  );

router.get(
  "/",
  executionAnalyticsController
    .getStatistics
);

module.exports = router;