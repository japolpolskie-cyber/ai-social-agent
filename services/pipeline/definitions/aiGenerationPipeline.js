// ======================================================
// AI Generation Pipeline Definition
// ======================================================

const {
  createPipelineDefinition,
} = require("./createPipelineDefinition");

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

module.exports = createPipelineDefinition({
  name: "ai-generation",

  version: "1.0.0",

  description:
    "Generates, validates, repairs, and processes AI social content.",

  stages: [
    validateInputStage,
    buildContextStage,
    routeModelStage,
    buildPromptStage,
    executeAIStage,
    processOutputStage,
  ],

  metadata: {
    category: "content-generation",
    reusable: true,
  },
});