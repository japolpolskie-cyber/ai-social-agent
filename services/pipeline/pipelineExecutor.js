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

const {
  createRuntimeLifecycleManager,
} = require(
  "./lifecycle/runtimeLifecycleManager"
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

  if (!runtime) {
    throw new PipelineError({
      code:
        "PIPELINE_RUNTIME_INVALID",

      message:
        `Pipeline "${definition?.name || "unknown"}" ` +
        "has no runtime.",

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
        "must return a valid context.",

      stage:
        "pipeline-executor",

      statusCode: 500,
    });
  }

  return context;
}

// ======================================================
// Context State
// ======================================================

function ensureContextState(context) {
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

// ======================================================
// Metadata
// ======================================================

function applyExecutionConfiguration(
  context,
  configuration
) {
  ensureContextState(
    context
  );

  context.execution.id =
    configuration.executionId;

  context.metadata.executionId =
    configuration.executionId;

  context.metadata.execution = {
    ...configuration.metadata,
  };
}

function applyPipelineMetadata(
  context,
  resolution
) {
  ensureContextState(
    context
  );

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
  ensureContextState(
    context
  );

  context.metadata.startedAt =
    context.execution.startedAt ||
    null;

  context.metadata.completedAt =
    context.execution.completedAt ||
    null;

  context.metadata.duration =
    context.execution.duration ||
    0;
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
    validateRuntime(
      definition
    );

  const context =
    validateContext(
      runtime.createContext(
        request.input,
        {
          endpoint:
            request.endpoint,

          resolution,

          configuration:
            request.configuration,
        }
      ),
      definition
    );

  applyExecutionConfiguration(
    context,
    request.configuration
  );

  applyPipelineMetadata(
    context,
    resolution
  );

  const lifecycleManager =
    createRuntimeLifecycleManager({
      runtime,
      runner:
        pipelineRunner,
    });

  return lifecycleManager.run({
    definition,
    context,
    request,

    onExecutionCompleted:
      applyExecutionMetadata,
  });
}

module.exports = {
  execute,
};