// ======================================================
// AI Generation Pipeline Definition
// ======================================================

const validateInputStage = require(
  "../stages/validateInputStage"
);

const buildContextStage = require(
  "../stages/buildContextStage"
);

const routeModelStage = require(
  "../stages/routeModelStage"
);

const buildPromptStage = require(
  "../stages/buildPromptStage"
);

const executeAIStage = require(
  "../stages/executeAIStage"
);

const processOutputStage = require(
  "../stages/processOutputStage"
);

const aiGenerationPipeline = Object.freeze({
  name: "ai-generation",

  version: "1.0.0",

  description:
    "Generates, validates, repairs, and processes AI social content.",

  stages: Object.freeze([
    validateInputStage,
    buildContextStage,
    routeModelStage,
    buildPromptStage,
    executeAIStage,
    processOutputStage,
  ]),

  metadata: Object.freeze({
    category: "content-generation",
    reusable: true,
  }),
});

module.exports = aiGenerationPipeline;