// ======================================================
// Pipeline Resolution
// ======================================================

function validateDefinition(definition) {
  if (!definition || typeof definition !== "object") {
    throw new TypeError(
      "Pipeline resolution requires a valid pipeline definition."
    );
  }

  if (
    typeof definition.name !== "string" ||
    definition.name.trim().length === 0
  ) {
    throw new TypeError(
      "Resolved pipeline definition must provide a valid name."
    );
  }

  return definition;
}

function normalizeNullableName(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0
    ? normalized
    : null;
}

function createPipelineResolution({
  requestedPipeline = null,
  resolvedPipeline,
  source,
  definition,
}) {
  validateDefinition(definition);

  const normalizedRequestedPipeline =
    normalizeNullableName(requestedPipeline);

  const normalizedResolvedPipeline =
    normalizeNullableName(resolvedPipeline);

  if (!normalizedResolvedPipeline) {
    throw new TypeError(
      "Pipeline resolution requires a resolved pipeline name."
    );
  }

  if (
    source !== "request" &&
    source !== "default"
  ) {
    throw new TypeError(
      'Pipeline resolution source must be either "request" or "default".'
    );
  }

  return Object.freeze({
    requestedPipeline:
      normalizedRequestedPipeline,

    resolvedPipeline:
      normalizedResolvedPipeline,

    source,

    definition,
  });
}

module.exports = {
  createPipelineResolution,
};