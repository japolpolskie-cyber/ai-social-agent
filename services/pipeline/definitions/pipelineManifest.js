// ======================================================
// Pipeline Manifest
// ======================================================

const aiGenerationPipeline = require(
  "./aiGenerationPipeline"
);

// ======================================================
// Registered Pipeline Definitions
// ======================================================

module.exports = Object.freeze([
  aiGenerationPipeline,
]);