// ======================================================
// Pipeline Registry Bootstrap
// ======================================================

const pipelineRegistry = require(
  "./pipelineRegistry"
);

const aiGenerationPipeline = require(
  "../definitions/aiGenerationPipeline"
);

let bootstrapped = false;

function bootstrapPipelineRegistry() {
  if (bootstrapped) {
    return pipelineRegistry;
  }

  if (!pipelineRegistry.has(
    aiGenerationPipeline.name
  )) {
    pipelineRegistry.register(
      aiGenerationPipeline
    );
  }

  bootstrapped = true;

  return pipelineRegistry;
}

function isPipelineRegistryBootstrapped() {
  return bootstrapped;
}

function resetPipelineRegistry() {
  pipelineRegistry.clear();
  bootstrapped = false;
}

module.exports = {
  bootstrapPipelineRegistry,
  isPipelineRegistryBootstrapped,
  resetPipelineRegistry,
};