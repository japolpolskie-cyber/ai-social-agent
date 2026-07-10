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

const aiGenerationPipeline = require(
  "./definitions/aiGenerationPipeline"
);

// ======================================================
// Execute Pipeline
// ======================================================

async function execute(input = {}) {
  const context = createPipelineContext(input);

  context.workflow =
    `${input.platform || ""} ${input.type || ""}`.trim();

  context.endpoint =
    input.endpoint || "/ai/generate";

  context.metadata.pipelineVersion =
    aiGenerationPipeline.version;

  await pipelineRunner.run({
    name: aiGenerationPipeline.name,
    context,
    stages: aiGenerationPipeline.stages,
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