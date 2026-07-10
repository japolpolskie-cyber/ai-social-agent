// ======================================================
// Pipeline Resolver
// ======================================================

const {
  createPipelineResolution,
} = require("./pipelineResolution");

const {
  PipelineResolutionError,
} = require("./pipelineResolutionError");

// ======================================================
// Validation
// ======================================================

function validateRegistry(registry) {
  if (!registry || typeof registry !== "object") {
    throw new TypeError(
      "Pipeline resolver requires a registry."
    );
  }

  if (typeof registry.get !== "function") {
    throw new TypeError(
      "Pipeline resolver registry must provide get()."
    );
  }

  if (typeof registry.list !== "function") {
    throw new TypeError(
      "Pipeline resolver registry must provide list()."
    );
  }

  return registry;
}

function normalizePipelineName(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0
    ? normalized
    : null;
}

function getAvailablePipelineNames(registry) {
  const definitions = registry.list();

  if (!Array.isArray(definitions)) {
    return [];
  }

  return definitions
    .filter(
      (definition) =>
        definition &&
        typeof definition.name === "string"
    )
    .map((definition) =>
      definition.name.trim()
    )
    .filter(Boolean)
    .sort();
}

// ======================================================
// Factory
// ======================================================

function createPipelineResolver({
  registry,
  defaultPipelineName,
}) {
  validateRegistry(registry);

  const normalizedDefaultPipelineName =
    normalizePipelineName(
      defaultPipelineName
    );

  if (!normalizedDefaultPipelineName) {
    throw new TypeError(
      "Pipeline resolver requires a valid default pipeline name."
    );
  }

  function resolve({
    pipelineName = null,
  } = {}) {
    const requestedPipeline =
      normalizePipelineName(pipelineName);

    const resolvedPipeline =
      requestedPipeline ||
      normalizedDefaultPipelineName;

    const source = requestedPipeline
      ? "request"
      : "default";

    const definition =
      registry.get(resolvedPipeline);

    if (!definition) {
      const availablePipelines =
        getAvailablePipelineNames(registry);

      throw new PipelineResolutionError(
        `Pipeline "${resolvedPipeline}" is not registered.`,
        {
          requestedPipeline,
          resolvedPipeline,
          availablePipelines,
          reason: "pipeline_not_registered",
        }
      );
    }

    return createPipelineResolution({
      requestedPipeline,
      resolvedPipeline,
      source,
      definition,
    });
  }

  return Object.freeze({
    resolve,

    getDefaultPipelineName() {
      return normalizedDefaultPipelineName;
    },

    listAvailablePipelines() {
      return getAvailablePipelineNames(
        registry
      );
    },
  });
}

module.exports = {
  createPipelineResolver,
};