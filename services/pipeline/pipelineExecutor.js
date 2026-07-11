// ======================================================
// Pipeline Executor
// ======================================================

const PipelineError = require(
  "./pipelineError"
);

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
// Defaults
// ======================================================

const DEFAULT_PIPELINE_NAME =
  "ai-generation";

// ======================================================
// Input Validation
// ======================================================

function normalizeInput(input) {
  if (
    input === undefined ||
    input === null
  ) {
    return {};
  }

  if (
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    throw new PipelineError({
      code: "PIPELINE_INPUT_INVALID",
      message:
        "Pipeline execution input must be an object.",
      stage: "pipeline-executor",
      statusCode: 400,
    });
  }

  return input;
}

// ======================================================
// Resolver Factory
// ======================================================

function createResolver() {
  const registry =
    bootstrapPipelineRegistry();

  return createPipelineResolver({
    registry,
    defaultPipelineName:
      DEFAULT_PIPELINE_NAME,
  });
}

// ======================================================
// Runtime Validation
// ======================================================

function validateRuntime(definition) {
  const runtime =
    definition?.runtime;

  if (
    !runtime ||
    typeof runtime.createContext !== "function" ||
    typeof runtime.createResult !== "function"
  ) {
    throw new PipelineError({
      code: "PIPELINE_RUNTIME_INVALID",
      message:
        `Pipeline "${definition?.name || "unknown"}" ` +
        "does not provide a valid runtime.",
      stage: "pipeline-executor",
      statusCode: 500,
    });
  }

  return runtime;
}

// ======================================================
// Metadata
// ======================================================

function applyPipelineMetadata(
  context,
  resolution
) {
  const definition =
    resolution.definition;

  if (
    !context.metadata ||
    typeof context.metadata !== "object"
  ) {
    context.metadata = {};
  }

  context.metadata.pipelineVersion =
    definition.version;

  context.metadata.pipeline = {
    requestedName:
      resolution.requestedPipeline,

    resolvedName:
      resolution.resolvedPipeline,

    source:
      resolution.source,

    version:
      definition.version,
  };
}

function applyExecutionMetadata(context) {
  if (
    !context.metadata ||
    typeof context.metadata !== "object"
  ) {
    context.metadata = {};
  }

  context.metadata.startedAt =
    context.execution?.startedAt || null;

  context.metadata.completedAt =
    context.execution?.completedAt || null;

  context.metadata.duration =
    context.execution?.duration || 0;
}

// ======================================================
// Execute
// ======================================================

async function execute({
  pipelineName = null,
  input = {},
  endpoint = null,
} = {}) {
  const normalizedInput =
    normalizeInput(input);

  const resolver =
    createResolver();

  const resolution =
    resolver.resolve({
      pipelineName,
    });

  const definition =
    resolution.definition;

  const runtime =
    validateRuntime(definition);

  const context =
    runtime.createContext(
      normalizedInput,
      {
        endpoint,
        resolution,
      }
    );

  if (
    !context ||
    typeof context !== "object"
  ) {
    throw new PipelineError({
      code: "PIPELINE_CONTEXT_INVALID",
      message:
        `Pipeline "${definition.name}" runtime ` +
        "must create a valid context object.",
      stage: "pipeline-executor",
      statusCode: 500,
    });
  }

  applyPipelineMetadata(
    context,
    resolution
  );

  await pipelineRunner.run({
    name: definition.name,
    context,
    stages: definition.stages,
  });

  applyExecutionMetadata(context);

  return runtime.createResult(
    context,
    {
      resolution,
    }
  );
}

module.exports = {
  execute,
};