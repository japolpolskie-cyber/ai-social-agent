// ======================================================
// Execution Replay Routes
// ======================================================

const express = require(
  "express"
);

const router =
  express.Router();

const executionReplayController =
  require(
    "../controllers/executionReplay.controller"
  );

router.post(
  "/:executionId/replay",
  executionReplayController
    .replayExecution
);

module.exports = router;