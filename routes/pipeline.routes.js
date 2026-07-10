// ======================================================
// Pipeline Routes
// ======================================================

const express = require("express");

const router = express.Router();

const pipelineController = require(
  "../controllers/pipeline.controller"
);

router.get(
  "/",
  pipelineController.getPipelines
);

router.get(
  "/:name",
  pipelineController.getPipeline
);

module.exports = router;