// ======================================================
// Pipeline Definition Builder
// ======================================================

function assertNonEmptyString(value, field) {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new TypeError(
      `Pipeline definition requires a valid "${field}".`
    );
  }

  return value.trim();
}

function assertStages(stages) {
  if (
    !Array.isArray(stages) ||
    stages.length === 0
  ) {
    throw new TypeError(
      "Pipeline definition requires at least one stage."
    );
  }

  stages.forEach((stage, index) => {
    if (
      !stage ||
      typeof stage.name !== "string" ||
      typeof stage.execute !== "function"
    ) {
      throw new TypeError(
        `Invalid stage at index ${index}.`
      );
    }
  });

  return Object.freeze([...stages]);
}

function createPipelineDefinition({
  name,
  version,
  description = "",
  metadata = {},
  stages,
} = {}) {
  return Object.freeze({
    name: assertNonEmptyString(name, "name"),

    version: assertNonEmptyString(
      version,
      "version"
    ),

    description,

    metadata: Object.freeze({
      ...metadata,
    }),

    stages: assertStages(stages),
  });
}

module.exports = {
  createPipelineDefinition,
};