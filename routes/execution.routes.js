// ======================================================
// Execution Routes
// ======================================================

const express = require(
  "express"
);

const router =
  express.Router();

const executionController =
  require(
    "../controllers/execution.controller"
  );

router.get(
  "/",
  executionController.getExecutions
);

router.get(
  "/:executionId",
  executionController.getExecution
);

module.exports = router;