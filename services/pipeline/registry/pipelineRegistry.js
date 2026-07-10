// ======================================================
// Pipeline Registry
// ======================================================

const registry = new Map();

function validateDefinition(definition) {
  if (!definition || typeof definition !== "object") {
    throw new TypeError(
      "Pipeline registry requires a pipeline definition."
    );
  }

  if (
    typeof definition.name !== "string" ||
    definition.name.trim().length === 0
  ) {
    throw new TypeError(
      "Pipeline definition must provide a valid name."
    );
  }

  return definition;
}

function register(definition) {
  validateDefinition(definition);

  if (registry.has(definition.name)) {
    throw new Error(
      `Pipeline "${definition.name}" is already registered.`
    );
  }

  registry.set(definition.name, definition);

  return definition;
}

function get(name) {
  return registry.get(name) || null;
}

function has(name) {
  return registry.has(name);
}

function list() {
  return Array.from(registry.values());
}

function unregister(name) {
  return registry.delete(name);
}

function clear() {
  registry.clear();
}

module.exports = {
  register,
  get,
  has,
  list,
  unregister,
  clear,
};