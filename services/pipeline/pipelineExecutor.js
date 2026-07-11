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

const {
  createPipelineExecutionRequest,
} = require(
  "./execution/pipelineExecutionRequest"
);

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

  if (
    !runtime ||
    typeof runtime.createContext !== "function" ||
    typeof runtime.createResult !== "function"
  ) {
    throw new PipelineError({
      code:
        "PIPELINE_RUNTIME_INVALID",

      message:
        `Pipeline "${definition?.name || "unknown"}" ` +
        "does not provide a valid runtime.",

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
        `Pipeline "${definition.name}" runtime ` +
        "must create a valid context object.",

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
  if (
    !context.metadata ||
    typeof context.metadata !== "object" ||
    Array.isArray(context.metadata)
  ) {
    context.metadata = {};
  }

  if (
    !context.execution ||
    typeof context.execution !== "object" ||
    Array.isArray(context.execution)
  ) {
    context.execution = {};
  }
}

function applyRequestMetadata(
  context,
  request
) {
  ensureContextMetadata(context);

  const executionId =
    request.options.executionId;

  context.execution.id =
    executionId;

  context.metadata.executionId =
    executionId;

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

function applyExecutionMetadata(context) {
  ensureContextMetadata(context);

  context.metadata.startedAt =
    context.execution.startedAt || null;

  context.metadata.completedAt =
    context.execution.completedAt || null;

  context.metadata.duration =
    context.execution.duration || 0;
}

// ======================================================
// Execution
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

  return runtime.createResult(
    context,
    {
      request,
      resolution,
    }
  );
}

module.exports = {
  execute,
};