// ======================================================
// Monitoring Routes
// ======================================================

const express = require(
  "express"
);

const router =
  express.Router();

const monitoringController = require(
  "../controllers/monitoring.controller"
);

router.get(
  "/",
  monitoringController
    .getMonitoring
);

module.exports = router;