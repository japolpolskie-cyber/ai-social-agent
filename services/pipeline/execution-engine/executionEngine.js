// ======================================================
// Pipeline Execution Engine
// ======================================================

const PipelineError = require(
  "../pipelineError"
);

const {
  PIPELINE_EVENTS,
} = require(
  "../events/pipelineEvents"
);

const {
  createPipelineEvent,
} = require(
  "../events/pipelineEvent"
);

const pipelineEventBus = require(
  "../events/pipelineEventBus"
);

const {
  createExecutionEngine,
} = require(
  "./createExecutionEngine"
);

const {
  createPipelineExecutionState,
} = require(
  "../execution-state/executionState"
);

// ======================================================
// Context Validation
// ======================================================

function validateContext(context) {
  if (
    !context ||
    typeof context !== "object" ||
    Array.isArray(context)
  ) {
    throw new PipelineError({
      code:
        "PIPELINE_CONTEXT_INVALID",

      message:
        "Pipeline execution engine requires a valid context.",

      stage:
        "execution-engine",

      statusCode: 500,
    });
  }

  return context;
}

// ======================================================
// Value Normalization
// ======================================================

function normalizePipelineName(value) {
  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  return "unnamed-pipeline";
}

function normalizeStageName(
  value,
  index = 0
) {
  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  return `stage-${index + 1}`;
}

// ======================================================
// Event Helpers
// ======================================================

function getExecutionId(context) {
  return (
    context.execution?.id ||
    context.metadata?.executionId ||
    null
  );
}

async function publishEvent(eventData) {
  try {
    const event =
      createPipelineEvent(
        eventData
      );

    await pipelineEventBus.publish(
      event
    );
  } catch {
    // Observability failures must never
    // interrupt pipeline execution.
  }
}

// ======================================================
// Metrics
// ======================================================

function createStageMetric({
  stage,
  status,
  startedAt,
  completedAt,
}) {
  return {
    stage,

    status,

    duration:
      completedAt - startedAt,

    startedAt:
      new Date(
        startedAt
      ).toISOString(),

    completedAt:
      new Date(
        completedAt
      ).toISOString(),
  };
}

// ======================================================
// Error Normalization
// ======================================================

function normalizeStageError(
  error,
  stageName
) {
  if (
    PipelineError.isPipelineError(
      error
    )
  ) {
    if (!error.stage) {
      error.stage =
        stageName;
    }

    return error;
  }

  return new PipelineError({
    code:
      error?.code ||
      "PIPELINE_STAGE_FAILED",

    message:
      error?.message ||
      `Pipeline stage "${stageName}" failed.`,

    stage:
      stageName,

    statusCode:
      error?.statusCode ||
      500,

    details:
      error?.details ||
      null,

    cause:
      error,
  });
}

// ======================================================
// Factory
// ======================================================

function createPipelineExecutionEngine({
  context,
  pipelineName,
  stageCount,
} = {}) {
  validateContext(context);

  const normalizedPipelineName =
    normalizePipelineName(
      pipelineName
    );

  const normalizedStageCount =
    Number.isInteger(stageCount) &&
    stageCount >= 0
      ? stageCount
      : 0;

  const executionState =
    createPipelineExecutionState(
      context
    );

  let pipelineFailure = null;

  const engine =
    createExecutionEngine({
      async initializeExecution() {
        executionState.initialize(
          normalizedPipelineName
        );

        const snapshot =
          executionState.snapshot();

        await publishEvent({
          name:
            PIPELINE_EVENTS.PIPELINE_STARTED,

          pipeline:
            normalizedPipelineName,

          executionId:
            getExecutionId(context),

          status:
            "running",

          timestamp:
            snapshot.startedAt,

          metadata: {
            stageCount:
              normalizedStageCount,
          },
        });

        return snapshot;
      },

      async startStage({
        stageName,
        stageIndex,
      } = {}) {
        const normalizedStageName =
          normalizeStageName(
            stageName,
            stageIndex
          );

        const startedAt =
          executionState.startStage(
            normalizedStageName
          );

        await publishEvent({
          name:
            PIPELINE_EVENTS.STAGE_STARTED,

          pipeline:
            normalizedPipelineName,

          executionId:
            getExecutionId(context),

          stage:
            normalizedStageName,

          status:
            "running",

          timestamp:
            new Date(
              startedAt
            ).toISOString(),

          metadata: {
            stageIndex,

            stageNumber:
              stageIndex + 1,

            totalStages:
              normalizedStageCount,
          },
        });

        return {
          stageName:
            normalizedStageName,

          startedAt,
        };
      },

      async completeStage({
        stageName,
        stageIndex,
        startedAt,
      } = {}) {
        const completedAt =
          Date.now();

        const metric =
          createStageMetric({
            stage:
              stageName,

            status:
              "success",

            startedAt,

            completedAt,
          });

        executionState.completeStage(
          stageName,
          metric
        );

        await publishEvent({
          name:
            PIPELINE_EVENTS.STAGE_COMPLETED,

          pipeline:
            normalizedPipelineName,

          executionId:
            getExecutionId(context),

          stage:
            stageName,

          status:
            "success",

          timestamp:
            metric.completedAt,

          duration:
            metric.duration,

          metadata: {
            stageIndex,

            stageNumber:
              stageIndex + 1,

            totalStages:
              normalizedStageCount,
          },
        });

        return metric;
      },

      async failStage({
        error,
        stageName,
        stageIndex,
        startedAt,
      } = {}) {
        const completedAt =
          Date.now();

        const normalizedError =
          normalizeStageError(
            error,
            stageName
          );

        const metric =
          createStageMetric({
            stage:
              stageName,

            status:
              "failed",

            startedAt,

            completedAt,
          });

        executionState.failStage(
          metric
        );

        await publishEvent({
          name:
            PIPELINE_EVENTS.STAGE_FAILED,

          pipeline:
            normalizedPipelineName,

          executionId:
            getExecutionId(context),

          stage:
            stageName,

          status:
            "failed",

          timestamp:
            metric.completedAt,

          duration:
            metric.duration,

          metadata: {
            stageIndex,

            stageNumber:
              stageIndex + 1,

            totalStages:
              normalizedStageCount,
          },

          error:
            normalizedError,
        });

        return normalizedError;
      },

      async completeExecution() {
        executionState.completeExecution();

        const snapshot =
          executionState.snapshot();

        await publishEvent({
          name:
            PIPELINE_EVENTS.PIPELINE_COMPLETED,

          pipeline:
            normalizedPipelineName,

          executionId:
            getExecutionId(context),

          status:
            "success",

          timestamp:
            snapshot.completedAt,

          duration:
            snapshot.duration,

          metadata: {
            completedStages:
              snapshot.completedStages,

            stageMetrics:
              snapshot.stageMetrics,
          },
        });

        return snapshot;
      },

      async failExecution(error) {
        pipelineFailure =
          PipelineError.wrap(
            error,
            {
              code:
                "PIPELINE_EXECUTION_FAILED",

              message:
                "Pipeline execution failed.",

              stage:
                executionState
                  .snapshot()
                  .currentStage ||
                "execution-engine",

              statusCode:
                error?.statusCode ||
                500,
            }
          );

        executionState.failExecution();

        const snapshot =
          executionState.snapshot();

        await publishEvent({
          name:
            PIPELINE_EVENTS.PIPELINE_FAILED,

          pipeline:
            normalizedPipelineName,

          executionId:
            getExecutionId(context),

          stage:
            pipelineFailure.stage,

          status:
            "failed",

          timestamp:
            snapshot.completedAt,

          duration:
            snapshot.duration,

          metadata: {
            completedStages:
              snapshot.completedStages,

            stageMetrics:
              snapshot.stageMetrics,
          },

          error:
            pipelineFailure,
        });

        return pipelineFailure;
      },

      getExecution() {
        return executionState.snapshot();
      },
    });

  return Object.freeze({
    ...engine,

    getFailure() {
      return pipelineFailure;
    },
  });
}

module.exports = {
  createPipelineExecutionEngine,
};