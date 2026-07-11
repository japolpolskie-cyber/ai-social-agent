// ======================================================
// Pipeline Discovery Builder
// ======================================================

function createPipelineDiscovery({
  discover,
} = {}) {
  if (typeof discover !== "function") {
    throw new TypeError(
      'Pipeline discovery requires "discover()".'
    );
  }

  return Object.freeze({
    discover,
  });
}

module.exports = {
  createPipelineDiscovery,
};