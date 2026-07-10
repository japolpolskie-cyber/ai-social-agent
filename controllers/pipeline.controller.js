// ======================================================
// Pipeline Controller
// ======================================================

const pipelineDiscoveryService = require(
  "../services/pipeline/pipelineDiscoveryService"
);

const responseService = require(
  "../services/responseService"
);

// ======================================================
// List Pipelines
// ======================================================

function getPipelines(req, res) {
  try {
    const result =
      pipelineDiscoveryService.getAllPipelines();

    return responseService.success(
      res,
      result
    );
  } catch (error) {
    const statusCode =
      error.statusCode || 500;

    return responseService.error(
      res,
      error,
      statusCode
    );
  }
}

// ======================================================
// Get Pipeline
// ======================================================

function getPipeline(req, res) {
  try {
    const result =
      pipelineDiscoveryService.getPipelineByName(
        req.params.name
      );

    return responseService.success(
      res,
      result
    );
  } catch (error) {
    const statusCode =
      error.statusCode || 500;

    return responseService.error(
      res,
      error,
      statusCode
    );
  }
}

module.exports = {
  getPipelines,
  getPipeline,
};