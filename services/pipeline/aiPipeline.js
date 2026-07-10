// ======================================================
// AI Pipeline
// ======================================================

const {
  createPipelineContext,
} = require("./pipelineContext");

const {
  createPipelineResult,
} = require("./pipelineResult");

const pipelineRunner = require("./pipelineRunner");

const validateInputStage = require(
  "./stages/validateInputStage"
);

const buildContextStage = require(
  "./stages/buildContextStage"
);

const routeModelStage = require(
  "./stages/routeModelStage"
);

const buildPromptStage = require(
  "./stages/buildPromptStage"
);

const executeAIStage = require(
  "./stages/executeAIStage"
);

const processOutputStage = require(
  "./stages/processOutputStage"
);

// ======================================================
// Pipeline Definition
// ======================================================

const PIPELINE_NAME = "ai-generation";

const stages = [
  validateInputStage,
  buildContextStage,
  routeModelStage,
  buildPromptStage,
  executeAIStage,
  processOutputStage,
];

// ======================================================
// Execute Pipeline
// ======================================================

async function execute(input = {}) {
  const context = createPipelineContext(input);

  context.workflow =
    `${input.platform || ""} ${input.type || ""}`.trim();

  context.endpoint =
    input.endpoint || "/ai/generate";

  await pipelineRunner.run({
    name: PIPELINE_NAME,
    context,
    stages,
  });

  context.metadata.startedAt =
    context.execution.startedAt;

  context.metadata.completedAt =
    context.execution.completedAt;

  context.metadata.duration =
    context.execution.duration;

  return createPipelineResult(context);
}

module.exports = {
  execute,
};