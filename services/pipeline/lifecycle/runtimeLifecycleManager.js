// ======================================================
// Runtime Lifecycle Manager
// ======================================================

const PipelineError = require(
  "../pipelineError"
);

const {
  createRuntimeLifecycle,
} = require(
  "./createRuntimeLifecycle"
);

const {
  createPipelineExecutionRecord,
} = require(
  "../execution-record/executionRecord"
);

const executionStore = require(
  "../execution-store/executionStore"
);

// ======================================================
// Lifecycle Error Normalization
// ======================================================

function normalizeLifecycleError(
  error,
  phase
) {
  if (
    PipelineError.isPipelineError(
      error
    )
  ) {
    if (!error.stage) {
      error.stage =
        `runtime-${phase}`;
    }

    return error;
  }

  return new PipelineError({
    code:
      "PIPELINE_RUNTIME_LIFECYCLE_FAILED",

    message:
      `Pipeline runtime lifecycle failed during "${phase}".`,

    stage:
      `runtime-${phase}`,

    statusCode:
      error?.statusCode ||
      500,

    details: {
      phase,

      originalCode:
        error?.code ||
        null,

      originalMessage:
        error?.message ||
        null,
    },

    cause:
      error,
  });
}

// ======================================================
// Cleanup Failure Attachment
// ======================================================

function attachCleanupFailure(
  primaryError,
  cleanupError
) {
  if (!primaryError) {
    return cleanupError;
  }

  const primaryDetails =
    primaryError.details &&
    typeof primaryError.details ===
      "object"
      ? primaryError.details
      : {};

  primaryError.details = {
    ...primaryDetails,

    cleanupFailure: {
      code:
        cleanupError.code,

      message:
        cleanupError.message,

      stage:
        cleanupError.stage,
    },
  };

  return primaryError;
}

// ======================================================
// Store Failure Handling
// ======================================================

function normalizeStoreError(error) {
  return {
    code:
      error?.code ||
      "PIPELINE_EXECUTION_STORE_FAILED",

    message:
      error?.message ||
      "Pipeline execution record could not be stored.",
  };
}

async function storeExecutionRecord(
  context,
  record
) {
  try {
    await executionStore.save(
      record
    );

    return true;
  } catch (error) {
    if (
      !context.metadata ||
      typeof context.metadata !==
        "object"
    ) {
      context.metadata = {};
    }

    context.metadata
      .executionStoreError =
      normalizeStoreError(
        error
      );

    return false;
  }
}

// ======================================================
// Factory
// ======================================================

function createRuntimeLifecycleManager({
  runtime,
  runner,
} = {}) {
  if (
    !runtime ||
    typeof runtime !== "object"
  ) {
    throw new TypeError(
      "Runtime lifecycle manager requires a runtime."
    );
  }

  if (
    !runner ||
    typeof runner.run !== "function"
  ) {
    throw new TypeError(
      "Runtime lifecycle manager requires a runner with run()."
    );
  }

  const lifecycle =
    createRuntimeLifecycle({
      async initialize(
        context,
        request
      ) {
        return runtime.initialize(
          context,
          request
        );
      },

      async beforeExecution(
        context,
        request
      ) {
        return runtime.beforeExecution(
          context,
          request
        );
      },

      async execute({
        definition,
        context,
      }) {
        return runner.run({
          name:
            definition.name,

          context,

          stages:
            definition.stages,
        });
      },

      async afterExecution(
        context,
        request
      ) {
        return runtime.afterExecution(
          context,
          request
        );
      },

      async cleanup(
        context,
        request
      ) {
        return runtime.cleanup(
          context,
          request
        );
      },
    });

  async function run({
    definition,
    context,
    request,
    resolution,
    onExecutionCompleted = null,
  } = {}) {
    let primaryError =
      null;

    let result;

    try {
      try {
        await lifecycle.initialize(
          context,
          request
        );
      } catch (error) {
        throw normalizeLifecycleError(
          error,
          "initialize"
        );
      }

      try {
        await lifecycle.beforeExecution(
          context,
          request
        );
      } catch (error) {
        throw normalizeLifecycleError(
          error,
          "before-execution"
        );
      }

      await lifecycle.execute({
        definition,
        context,
      });

      if (
        typeof onExecutionCompleted ===
        "function"
      ) {
        onExecutionCompleted(
          context
        );
      }

      try {
        await lifecycle.afterExecution(
          context,
          request
        );
      } catch (error) {
        throw normalizeLifecycleError(
          error,
          "after-execution"
        );
      }

      result =
        runtime.createResult(
          context,
          {
            request,
            resolution,
          }
        );
    } catch (error) {
      primaryError =
        error;
    }

    try {
      await lifecycle.cleanup(
        context,
        request
      );
    } catch (error) {
      const cleanupError =
        normalizeLifecycleError(
          error,
          "cleanup"
        );

      primaryError =
        attachCleanupFailure(
          primaryError,
          cleanupError
        );
    }

    context.executionRecord =
      createPipelineExecutionRecord({
        context,
        request,
        resolution,

        error:
          primaryError,
      });

    await storeExecutionRecord(
      context,
      context.executionRecord
    );

    if (primaryError) {
      throw primaryError;
    }

    return result;
  }

  return Object.freeze({
    run,
  });
}

module.exports = {
  createRuntimeLifecycleManager,
};