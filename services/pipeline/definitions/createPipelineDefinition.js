// ======================================================
// Pipeline Definition Builder
// ======================================================

const {
  createPipelineMetadata,
} = require("../models/pipelineMetadata");

// ======================================================
// String Validation
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

function normalizeDescription(description) {
  if (
    description === undefined ||
    description === null
  ) {
    return "";
  }

  if (typeof description !== "string") {
    throw new TypeError(
      'Pipeline definition "description" must be a string.'
    );
  }

  return description.trim();
}

// ======================================================
// Stage Validation
// ======================================================

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
      stage.name.trim().length === 0 ||
      typeof stage.execute !== "function"
    ) {
      throw new TypeError(
        `Invalid stage at index ${index}.`
      );
    }
  });

  return Object.freeze([...stages]);
}

// ======================================================
// Runtime Validation
// ======================================================

function assertRuntime(runtime) {
  if (!runtime || typeof runtime !== "object") {
    throw new TypeError(
      "Pipeline definition requires a runtime."
    );
  }

  if (
    typeof runtime.createContext !== "function"
  ) {
    throw new TypeError(
      "Pipeline runtime must provide createContext()."
    );
  }

  if (
    typeof runtime.createResult !== "function"
  ) {
    throw new TypeError(
      "Pipeline runtime must provide createResult()."
    );
  }

  return Object.freeze({
    createContext: runtime.createContext,
    createResult: runtime.createResult,
  });
}

// ======================================================
// Builder
// ======================================================

function createPipelineDefinition({
  name,
  version,
  description = "",
  metadata = {},
  runtime,
  stages,
} = {}) {
  return Object.freeze({
    name: assertNonEmptyString(
      name,
      "name"
    ),

    version: assertNonEmptyString(
      version,
      "version"
    ),

    description:
      normalizeDescription(description),

    metadata:
      createPipelineMetadata(metadata),

    runtime:
      assertRuntime(runtime),

    stages:
      assertStages(stages),
  });
}

module.exports = {
  createPipelineDefinition,
};