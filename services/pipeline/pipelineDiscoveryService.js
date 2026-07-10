// ======================================================
// Pipeline Discovery Service
// ======================================================

const {
  bootstrapPipelineRegistry,
} = require(
  "./registry/bootstrapPipelineRegistry"
);

const {
  createPipelineCatalog,
} = require(
  "./catalog/pipelineCatalog"
);

// ======================================================
// Catalog Factory
// ======================================================

function getPipelineCatalog() {
  const pipelineRegistry =
    bootstrapPipelineRegistry();

  return createPipelineCatalog({
    registry: pipelineRegistry,
  });
}

// ======================================================
// Discovery Operations
// ======================================================

function getAllPipelines() {
  const pipelineCatalog =
    getPipelineCatalog();

  const pipelines =
    pipelineCatalog.list();

  return {
    count: pipelines.length,
    pipelines,
  };
}

function getPipelineByName(name) {
  const pipelineCatalog =
    getPipelineCatalog();

  const pipeline =
    pipelineCatalog.get(name);

  if (!pipeline) {
    const error = new Error(
      `Pipeline "${name}" was not found.`
    );

    error.name =
      "PipelineNotFoundError";

    error.code =
      "PIPELINE_NOT_FOUND";

    error.statusCode = 404;

    throw error;
  }

  return {
    pipeline,
  };
}

module.exports = {
  getAllPipelines,
  getPipelineByName,
};