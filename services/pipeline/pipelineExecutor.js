// ======================================================
// Pipeline Executor
// ======================================================

const PipelineError = require("./pipelineError");

const pipelineRunner = require("./pipelineRunner");

const {
  bootstrapPipelineRegistry,
} = require("./registry/bootstrapPipelineRegistry");

const {
  createPipelineResolver,
} = require("./resolution/pipelineResolver");

const {
  createPipelineExecutionRequest,
} = require("./execution/pipelineExecutionRequest");

// ======================================================
// Defaults
// ======================================================

const DEFAULT_PIPELINE_NAME =
  "ai-generation";

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

  if (!runtime) {
    throw new PipelineError({
      code:
        "PIPELINE_RUNTIME_INVALID",

      message:
        `Pipeline "${definition?.name || "unknown"}" has no runtime.`,

      stage:
        "pipeline-executor",

      statusCode: 500,
    });
  }

  return runtime;
}

// ======================================================
// Context Validation
// ======================================================

function validateContext(
  context,
  definition
) {
  if (
    !context ||
    typeof context !== "object" ||
    Array.isArray(context)
  ) {
    throw new PipelineError({
      code:
        "PIPELINE_CONTEXT_INVALID",

      message:
        `Pipeline "${definition.name}" runtime must return a valid context.`,

      stage:
        "pipeline-executor",

      statusCode: 500,
    });
  }

  return context;
}

// ======================================================
// Metadata
// ======================================================

function ensureContextMetadata(context) {
  if (!context.metadata) {
    context.metadata = {};
  }

  if (!context.execution) {
    context.execution = {};
  }
}

function applyRequestMetadata(
  context,
  request
) {
  ensureContextMetadata(context);

  context.execution.id =
    request.options.executionId;

  context.metadata.executionId =
    request.options.executionId;

  context.metadata.execution = {
    ...request.options.metadata,
  };
}

function applyPipelineMetadata(
  context,
  resolution
) {
  ensureContextMetadata(context);

  const definition =
    resolution.definition;

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

function applyExecutionMetadata(
  context
) {
  ensureContextMetadata(context);

  context.metadata.startedAt =
    context.execution.startedAt;

  context.metadata.completedAt =
    context.execution.completedAt;

  context.metadata.duration =
    context.execution.duration;
}

// ======================================================
// Execute
// ======================================================

async function execute(command = {}) {

  const request =
    createPipelineExecutionRequest(
      command
    );

  const resolver =
    createResolver();

  const resolution =
    resolver.resolve({
      pipelineName:
        request.pipelineName,
    });

  const definition =
    resolution.definition;

  const runtime =
    validateRuntime(definition);

  const context =
    validateContext(
      runtime.createContext(
        request.input,
        {
          endpoint:
            request.endpoint,

          resolution,

          options:
            request.options,
        }
      ),
      definition
    );

  applyRequestMetadata(
    context,
    request
  );

  applyPipelineMetadata(
    context,
    resolution
  );

  // ==========================================
  // Runtime Lifecycle
  // ==========================================

  await runtime.initialize(
    context,
    request
  );

  await runtime.beforeExecution(
    context,
    request
  );

  try {

    await pipelineRunner.run({
      name:
        definition.name,

      context,

      stages:
        definition.stages,
    });

    applyExecutionMetadata(
      context
    );

    await runtime.afterExecution(
      context,
      request
    );

    return runtime.createResult(
      context,
      {
        request,
        resolution,
      }
    );

  } finally {

    await runtime.cleanup(
      context,
      request
    );

  }

}

module.exports = {
  execute,
};