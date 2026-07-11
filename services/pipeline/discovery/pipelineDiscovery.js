// ======================================================
// Pipeline Discovery
// ======================================================

const {
  createPipelineDiscovery,
} = require(
  "./createPipelineDiscovery"
);

const pipelineManifest = require(
  "../definitions/pipelineManifest"
);

function discover() {
  return Object.freeze([
    ...pipelineManifest,
  ]);
}

module.exports =
  createPipelineDiscovery({
    discover,
  });