// ======================================================
// Pipeline Summary Model
// ======================================================

function assertDefinition(definition) {
  if (
    !definition ||
    typeof definition !== "object"
  ) {
    throw new TypeError(
      "Pipeline summary requires a pipeline definition."
    );
  }

  if (
    typeof definition.name !== "string" ||
    definition.name.trim().length === 0
  ) {
    throw new TypeError(
      "Pipeline summary requires a valid pipeline name."
    );
  }

  return definition;
}

function normalizeMetadata(metadata = {}) {
  if (
    !metadata ||
    typeof metadata !== "object" ||
    Array.isArray(metadata)
  ) {
    return {};
  }

  return metadata;
}

function createPipelineSummary(definition) {
  assertDefinition(definition);

  const metadata =
    normalizeMetadata(definition.metadata);

  const stages = Array.isArray(
    definition.stages
  )
    ? definition.stages
    : [];

  const tags = Array.isArray(metadata.tags)
    ? [...metadata.tags]
    : [];

  return Object.freeze({
    name: definition.name,

    version:
      typeof definition.version === "string"
        ? definition.version
        : "",

    description:
      typeof definition.description === "string"
        ? definition.description
        : "",

    category:
      typeof metadata.category === "string"
        ? metadata.category
        : "general",

    tags: Object.freeze(tags),

    stageCount: stages.length,

    reusable:
      metadata.reusable === true,

    experimental:
      metadata.experimental === true,

    deprecated:
      metadata.deprecated === true,

    visibility:
      typeof metadata.visibility === "string"
        ? metadata.visibility
        : "internal",
  });
}

module.exports = {
  createPipelineSummary,
};