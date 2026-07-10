// ======================================================
// Pipeline Catalog
// ======================================================

const {
  createPipelineSummary,
} = require("../models/pipelineSummary");

// ======================================================
// Validation
// ======================================================

function validateRegistry(registry) {
  if (
    !registry ||
    typeof registry !== "object"
  ) {
    throw new TypeError(
      "Pipeline catalog requires a registry."
    );
  }

  if (typeof registry.get !== "function") {
    throw new TypeError(
      "Pipeline catalog registry must provide get()."
    );
  }

  if (typeof registry.has !== "function") {
    throw new TypeError(
      "Pipeline catalog registry must provide has()."
    );
  }

  if (typeof registry.list !== "function") {
    throw new TypeError(
      "Pipeline catalog registry must provide list()."
    );
  }

  return registry;
}

function normalizePipelineName(name) {
  if (typeof name !== "string") {
    return null;
  }

  const normalized = name.trim();

  return normalized.length > 0
    ? normalized
    : null;
}

// ======================================================
// Factory
// ======================================================

function createPipelineCatalog({
  registry,
} = {}) {
  validateRegistry(registry);

  function list() {
    const definitions = registry.list();

    if (!Array.isArray(definitions)) {
      return Object.freeze([]);
    }

    const summaries = definitions
      .map(createPipelineSummary)
      .sort((left, right) =>
        left.name.localeCompare(right.name)
      );

    return Object.freeze(summaries);
  }

  function get(name) {
    const normalizedName =
      normalizePipelineName(name);

    if (!normalizedName) {
      return null;
    }

    const definition =
      registry.get(normalizedName);

    if (!definition) {
      return null;
    }

    return createPipelineSummary(
      definition
    );
  }

  function exists(name) {
    const normalizedName =
      normalizePipelineName(name);

    if (!normalizedName) {
      return false;
    }

    return registry.has(normalizedName);
  }

  function listNames() {
    return Object.freeze(
      list().map(
        (summary) => summary.name
      )
    );
  }

  return Object.freeze({
    list,
    get,
    exists,
    listNames,
  });
}

module.exports = {
  createPipelineCatalog,
};