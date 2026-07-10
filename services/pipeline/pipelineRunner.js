// ======================================================
// Pipeline Runner
// ======================================================

const PipelineError = require("./pipelineError");

const {
  PIPELINE_EVENTS,
} = require("./events/pipelineEvents");

const {
  createPipelineEvent,
} = require("./events/pipelineEvent");

const pipelineEventBus = require(
  "./events/pipelineEventBus"
);

// ======================================================
// Stage Helpers
// ======================================================

function getStageName(stage, index) {
  if (
    stage &&
    typeof stage.name === "string" &&
    stage.name.trim()
  ) {
    return stage.name.trim();
  }

  return `stage-${index + 1}`;
}

function validateStages(stages) {
  if (!Array.isArray(stages) || stages.length === 0) {
    throw new PipelineError({
      code: "PIPELINE_STAGES_INVALID",
      message: "Pipeline requires at least one stage.",
      stage: "pipeline-runner",
      statusCode: 500,
    });
  }

  stages.forEach((stage, index) => {
    if (!stage || typeof stage.execute !== "function") {
      throw new PipelineError({
        code: "PIPELINE_STAGE_INVALID",
        message:
          `Pipeline stage at index ${index} must ` +
          "provide an execute function.",
        stage: getStageName(stage, index),
        statusCode: 500,
      });
    }
  });
}

// ======================================================
// Execution State
// ======================================================

function ensureExecutionState(context, pipelineName) {
  if (!context || typeof context !== "object") {
    throw new PipelineError({
      code: "PIPELINE_CONTEXT_INVALID",
      message: "Pipeline context must be an object.",
      stage: "pipeline-runner",
      statusCode: 500,
    });
  }

  if (
    !context.execution ||
    typeof context.execution !== "object"
  ) {
    context.execution = {
      pipeline: null,
      currentStage: null,
      completedStages: [],
      stageMetrics: [],
      startedAt: null,
      completedAt: null,
      duration: 0,
    };
  }

  context.execution.pipeline = pipelineName;
  context.execution.currentStage = null;
  context.execution.completedStages = [];
  context.execution.stageMetrics = [];
  context.execution.startedAt = null;
  context.execution.completedAt = null;
  context.execution.duration = 0;

  return context.execution;
}

function finalizeExecution(
  execution,
  pipelineStartedAt
) {
  const pipelineCompletedAt = Date.now();

  execution.completedAt =
    new Date(pipelineCompletedAt).toISOString();

  execution.duration =
    pipelineCompletedAt - pipelineStartedAt;

  execution.currentStage = null;
}

// ======================================================
// Error Handling
// ======================================================

function normalizeStageError(error, stageName) {
  if (PipelineError.isPipelineError(error)) {
    if (!error.stage) {
      error.stage = stageName;
    }

    return error;
  }

  return new PipelineError({
    code: error?.code || "PIPELINE_STAGE_FAILED",
    message:
      error?.message ||
      `Pipeline stage "${stageName}" failed.`,
    stage: stageName,
    statusCode: error?.statusCode || 500,
    details: error?.details || null,
    cause: error,
  });
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
    const event = createPipelineEvent(eventData);

    await pipelineEventBus.publish(event);
  } catch {
    // Pipeline event failures must never interrupt
    // the main pipeline execution.
  }
}

// ======================================================
// Pipeline Execution
// ======================================================

async function run({ name, context, stages }) {
  const pipelineName =
    typeof name === "string" && name.trim()
      ? name.trim()
      : "unnamed-pipeline";

  validateStages(stages);

  const execution = ensureExecutionState(
    context,
    pipelineName
  );

  const pipelineStartedAt = Date.now();

  execution.startedAt =
    new Date(pipelineStartedAt).toISOString();

  await publishEvent({
    name: PIPELINE_EVENTS.PIPELINE_STARTED,
    pipeline: pipelineName,
    executionId: getExecutionId(context),
    status: "running",
    timestamp: execution.startedAt,
    metadata: {
      stageCount: stages.length,
    },
  });

  let pipelineFailure = null;

  try {
    for (
      let index = 0;
      index < stages.length;
      index += 1
    ) {
      const stage = stages[index];
      const stageName = getStageName(stage, index);
      const stageStartedAt = Date.now();

      execution.currentStage = stageName;

      await publishEvent({
        name: PIPELINE_EVENTS.STAGE_STARTED,
        pipeline: pipelineName,
        executionId: getExecutionId(context),
        stage: stageName,
        status: "running",
        timestamp:
          new Date(stageStartedAt).toISOString(),
        metadata: {
          stageIndex: index,
          stageNumber: index + 1,
          totalStages: stages.length,
        },
      });

      try {
        const stageResult =
          await stage.execute(context);

        if (
          stageResult !== undefined &&
          stageResult !== null &&
          stageResult !== context
        ) {
          throw new PipelineError({
            code: "PIPELINE_STAGE_RESULT_INVALID",
            message:
              `Pipeline stage "${stageName}" must ` +
              "return the existing pipeline context " +
              "or no value.",
            stage: stageName,
            statusCode: 500,
          });
        }

        const stageCompletedAt = Date.now();

        const stageMetric = {
          stage: stageName,
          status: "success",
          duration:
            stageCompletedAt - stageStartedAt,
          startedAt:
            new Date(stageStartedAt).toISOString(),
          completedAt:
            new Date(stageCompletedAt).toISOString(),
        };

        execution.completedStages.push(stageName);
        execution.stageMetrics.push(stageMetric);

        await publishEvent({
          name: PIPELINE_EVENTS.STAGE_COMPLETED,
          pipeline: pipelineName,
          executionId: getExecutionId(context),
          stage: stageName,
          status: "success",
          timestamp: stageMetric.completedAt,
          duration: stageMetric.duration,
          metadata: {
            stageIndex: index,
            stageNumber: index + 1,
            totalStages: stages.length,
          },
        });
      } catch (error) {
        const stageFailedAt = Date.now();

        const normalizedError =
          normalizeStageError(
            error,
            stageName
          );

        const stageMetric = {
          stage: stageName,
          status: "failed",
          duration:
            stageFailedAt - stageStartedAt,
          startedAt:
            new Date(stageStartedAt).toISOString(),
          completedAt:
            new Date(stageFailedAt).toISOString(),
        };

        execution.stageMetrics.push(stageMetric);

        await publishEvent({
          name: PIPELINE_EVENTS.STAGE_FAILED,
          pipeline: pipelineName,
          executionId: getExecutionId(context),
          stage: stageName,
          status: "failed",
          timestamp: stageMetric.completedAt,
          duration: stageMetric.duration,
          metadata: {
            stageIndex: index,
            stageNumber: index + 1,
            totalStages: stages.length,
          },
          error: normalizedError,
        });

        throw normalizedError;
      }
    }

    return context;
  } catch (error) {
    pipelineFailure = PipelineError.wrap(error, {
      code: "PIPELINE_EXECUTION_FAILED",
      message: "Pipeline execution failed.",
      stage:
        execution.currentStage ||
        "pipeline-runner",
      statusCode: error?.statusCode || 500,
    });

    throw pipelineFailure;
  } finally {
    finalizeExecution(
      execution,
      pipelineStartedAt
    );

    if (pipelineFailure) {
      await publishEvent({
        name: PIPELINE_EVENTS.PIPELINE_FAILED,
        pipeline: pipelineName,
        executionId: getExecutionId(context),
        stage: pipelineFailure.stage,
        status: "failed",
        timestamp: execution.completedAt,
        duration: execution.duration,
        metadata: {
          completedStages:
            [...execution.completedStages],
          stageMetrics:
            [...execution.stageMetrics],
        },
        error: pipelineFailure,
      });
    } else {
      await publishEvent({
        name: PIPELINE_EVENTS.PIPELINE_COMPLETED,
        pipeline: pipelineName,
        executionId: getExecutionId(context),
        status: "success",
        timestamp: execution.completedAt,
        duration: execution.duration,
        metadata: {
          completedStages:
            [...execution.completedStages],
          stageMetrics:
            [...execution.stageMetrics],
        },
      });
    }
  }
}

module.exports = {
  run,
};