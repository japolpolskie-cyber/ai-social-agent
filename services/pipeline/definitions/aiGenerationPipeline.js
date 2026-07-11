// ======================================================
// AI Generation Pipeline Definition
// ======================================================

const {
  createPipelineDefinition,
} = require("./createPipelineDefinition");

const {
  createPipelineContext,
} = require("../pipelineContext");

const {
  createPipelineResult,
} = require("../pipelineResult");

const {
  createDefaultPipelineRuntime,
} = require(
  "../runtime/defaultPipelineRuntime"
);

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

// ======================================================
// Runtime
// ======================================================

function createContext(
  input = {},
  execution = {}
) {
  const context =
    createPipelineContext(input);

  context.workflow =
    `${input.platform || ""} ${input.type || ""}`.trim();

  context.endpoint =
    execution.endpoint ||
    input.endpoint ||
    "/ai/generate";

  return context;
}

function createResult(context) {
  return createPipelineResult(context);
}

const runtime =
  createDefaultPipelineRuntime({
    createContext,
    createResult,
  });

// ======================================================
// Definition
// ======================================================

module.exports =
  createPipelineDefinition({
    name: "ai-generation",

    version: "1.0.0",

    description:
      "Generates, validates, repairs, and processes AI social content.",

    metadata: {
      category:
        "content-generation",

      tags: [
        "ai",
        "social-content",
        "generation",
        "validation",
        "repair",
      ],

      reusable: true,

      experimental: false,

      deprecated: false,

      visibility: "internal",
    },

    runtime,

    stages: [
      validateInputStage,
      buildContextStage,
      routeModelStage,
      buildPromptStage,
      executeAIStage,
      processOutputStage,
    ],
  });