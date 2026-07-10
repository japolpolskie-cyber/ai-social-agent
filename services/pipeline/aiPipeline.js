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

const {
  bootstrapPipelineRegistry,
} = require(
  "./registry/bootstrapPipelineRegistry"
);

// ======================================================
// Pipeline Identity
// ======================================================

const PIPELINE_NAME = "ai-generation";

// ======================================================
// Execute Pipeline
// ======================================================

async function execute(input = {}) {
  const pipelineRegistry =
    bootstrapPipelineRegistry();

  const pipelineDefinition =
    pipelineRegistry.get(PIPELINE_NAME);

  if (!pipelineDefinition) {
    throw new Error(
      `Pipeline "${PIPELINE_NAME}" is not registered.`
    );
  }

  const context = createPipelineContext(input);

  context.workflow =
    `${input.platform || ""} ${input.type || ""}`.trim();

  context.endpoint =
    input.endpoint || "/ai/generate";

  context.metadata.pipelineVersion =
    pipelineDefinition.version;

  await pipelineRunner.run({
    name: pipelineDefinition.name,
    context,
    stages: pipelineDefinition.stages,
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