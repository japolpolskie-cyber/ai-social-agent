// ======================================================
// AI Pipeline
// ======================================================

const {
  createPipelineContext,
} = require("./pipelineContext");

const {
  createPipelineResult,
} = require("./pipelineResult");

const pipelineRunner = require(
  "./pipelineRunner"
);

const {
  bootstrapPipelineRegistry,
} = require(
  "./registry/bootstrapPipelineRegistry"
);

const {
  createPipelineResolver,
} = require(
  "./resolution/pipelineResolver"
);

// ======================================================
// Pipeline Identity
// ======================================================

const DEFAULT_PIPELINE_NAME =
  "ai-generation";

// ======================================================
// Resolve Pipeline
// ======================================================

function resolvePipeline(input = {}) {
  const pipelineRegistry =
    bootstrapPipelineRegistry();

  const pipelineResolver =
    createPipelineResolver({
      registry: pipelineRegistry,
      defaultPipelineName:
        DEFAULT_PIPELINE_NAME,
    });

  return pipelineResolver.resolve({
    pipelineName: input.pipeline,
  });
}

// ======================================================
// Apply Pipeline Metadata
// ======================================================

function applyPipelineMetadata(
  context,
  resolution
) {
  const pipelineDefinition =
    resolution.definition;

  context.metadata.pipelineVersion =
    pipelineDefinition.version;

  context.metadata.pipeline = {
    requestedName:
      resolution.requestedPipeline,

    resolvedName:
      resolution.resolvedPipeline,

    source:
      resolution.source,

    version:
      pipelineDefinition.version,
  };
}

// ======================================================
// Apply Execution Metadata
// ======================================================

function applyExecutionMetadata(context) {
  context.metadata.startedAt =
    context.execution.startedAt;

  context.metadata.completedAt =
    context.execution.completedAt;

  context.metadata.duration =
    context.execution.duration;
}

// ======================================================
// Execute Pipeline
// ======================================================

async function execute(input = {}) {
  const resolution =
    resolvePipeline(input);

  const pipelineDefinition =
    resolution.definition;

  const context =
    createPipelineContext(input);

  context.workflow =
    `${input.platform || ""} ${input.type || ""}`.trim();

  context.endpoint =
    input.endpoint || "/ai/generate";

  applyPipelineMetadata(
    context,
    resolution
  );

  await pipelineRunner.run({
    name: pipelineDefinition.name,
    context,
    stages: pipelineDefinition.stages,
  });

  applyExecutionMetadata(context);

  return createPipelineResult(context);
}

module.exports = {
  execute,
};