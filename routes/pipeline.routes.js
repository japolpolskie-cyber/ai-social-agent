// ======================================================
// Pipeline Routes
// ======================================================

const express = require("express");

const router = express.Router();

const pipelineController = require(
  "../controllers/pipeline.controller"
);

// ======================================================
// Discovery
// ======================================================

router.get(
  "/",
  pipelineController.getPipelines
);

router.get(
  "/:name",
  pipelineController.getPipeline
);

// ======================================================
// Execution
// ======================================================

router.post(
  "/:name/execute",
  pipelineController.executePipeline
);

module.exports = router;