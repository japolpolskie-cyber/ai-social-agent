// ======================================================
// AI Pipeline
// ======================================================

const {
  createPipelineContext,
} = require("./pipelineContext");

const {
  createPipelineResult,
} = require("./pipelineResult");

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

const stages = [
  validateInputStage,
  buildContextStage,
  routeModelStage,
  buildPromptStage,
  executeAIStage,
  processOutputStage,
];

async function execute(input = {}) {
  const context =
    createPipelineContext(input);

  context.workflow =
    `${input.platform} ${input.type}`;

  context.endpoint =
    input.endpoint || "/ai/generate";

  const startedAt = Date.now();

  for (const stage of stages) {
    await stage.execute(context);
  }

  context.metadata.completedAt =
    new Date().toISOString();

  context.metadata.duration =
    Date.now() - startedAt;

  return createPipelineResult(context);
}

module.exports = {
  execute,
};