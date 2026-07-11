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

// ======================================================
// Lifecycle Error Normalization
// ======================================================

function normalizeLifecycleError(
  error,
  phase
) {
  if (
    PipelineError.isPipelineError(error)
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
    typeof primaryError.details === "object"
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
    onExecutionCompleted = null,
  } = {}) {
    let primaryError = null;
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

      try {
        await lifecycle.execute({
          definition,
          context,
        });
      } catch (error) {
        throw error;
      }

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
          }
        );

      return result;
    } catch (error) {
      primaryError =
        error;

      throw error;
    } finally {
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

        if (primaryError) {
          attachCleanupFailure(
            primaryError,
            cleanupError
          );
        } else {
          throw cleanupError;
        }
      }
    }
  }

  return Object.freeze({
    run,
  });
}

module.exports = {
  createRuntimeLifecycleManager,
};