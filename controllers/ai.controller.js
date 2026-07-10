// ======================================================
// AI Controller
// ======================================================

const aiPipeline = require(
  "../services/pipeline/aiPipeline"
);

const responseService = require(
  "../services/responseService"
);

const templateDiscovery = require(
  "../services/templateDiscovery"
);

async function generate(req, res) {
  try {
    const result = await aiPipeline.execute({
      ...req.body,
      endpoint: "/ai/generate",
    });

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

function getTemplates(req, res) {
  try {
    const templates =
      templateDiscovery.getTemplates();

    return responseService.success(
      res,
      templates
    );
  } catch (error) {
    return responseService.error(
      res,
      error,
      500
    );
  }
}

module.exports = {
  generate,
  getTemplates,
};