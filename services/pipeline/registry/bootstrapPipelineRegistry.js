// ======================================================
// Pipeline Registry Bootstrap
// ======================================================

const pipelineRegistry = require(
  "./pipelineRegistry"
);

const pipelineDiscovery = require(
  "../discovery/pipelineDiscovery"
);

let bootstrapped = false;

// ======================================================
// Definition Validation
// ======================================================

function validateDiscoveredDefinitions(
  definitions
) {
  if (!Array.isArray(definitions)) {
    throw new TypeError(
      "Pipeline discovery must return an array of definitions."
    );
  }

  definitions.forEach(
    (definition, index) => {
      if (
        !definition ||
        typeof definition !== "object"
      ) {
        throw new TypeError(
          `Discovered pipeline at index ${index} is invalid.`
        );
      }

      if (
        typeof definition.name !== "string" ||
        definition.name.trim().length === 0
      ) {
        throw new TypeError(
          `Discovered pipeline at index ${index} ` +
          "must provide a valid name."
        );
      }
    }
  );

  return definitions;
}

// ======================================================
// Bootstrap
// ======================================================

function bootstrapPipelineRegistry() {
  if (bootstrapped) {
    return pipelineRegistry;
  }

  const definitions =
    validateDiscoveredDefinitions(
      pipelineDiscovery.discover()
    );

  definitions.forEach(
    (definition) => {
      if (
        !pipelineRegistry.has(
          definition.name
        )
      ) {
        pipelineRegistry.register(
          definition
        );
      }
    }
  );

  bootstrapped = true;

  return pipelineRegistry;
}

// ======================================================
// State
// ======================================================

function isPipelineRegistryBootstrapped() {
  return bootstrapped;
}

function resetPipelineRegistry() {
  pipelineRegistry.clear();
  bootstrapped = false;
}

// ======================================================
// Exports
// ======================================================

module.exports = {
  bootstrapPipelineRegistry,
  isPipelineRegistryBootstrapped,
  resetPipelineRegistry,
};