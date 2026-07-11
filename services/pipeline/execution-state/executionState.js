// ======================================================
// Pipeline Execution State
// ======================================================

const {
  createExecutionState,
} = require("./createExecutionState");

function ensureExecution(context) {
  if (!context.execution) {
    context.execution = {};
  }

  const execution =
    context.execution;

  execution.completedStages ??= [];
  execution.stageMetrics ??= [];

  return execution;
}

function createPipelineExecutionState(
  context
) {
  const execution =
    ensureExecution(context);

  let pipelineStartedAt = 0;

  return createExecutionState({
    initialize(pipelineName) {
      execution.pipeline =
        pipelineName;

      execution.currentStage =
        null;

      execution.completedStages =
        [];

      execution.stageMetrics =
        [];

      pipelineStartedAt =
        Date.now();

      execution.startedAt =
        new Date(
          pipelineStartedAt
        ).toISOString();

      execution.completedAt =
        null;

      execution.duration =
        0;
    },

    startStage(stageName) {
      execution.currentStage =
        stageName;

      return Date.now();
    },

    completeStage(
      stageName,
      metric
    ) {
      execution.completedStages.push(
        stageName
      );

      execution.stageMetrics.push(
        metric
      );
    },

    failStage(metric) {
      execution.stageMetrics.push(
        metric
      );
    },

    completeExecution() {
      const finished =
        Date.now();

      execution.currentStage =
        null;

      execution.completedAt =
        new Date(
          finished
        ).toISOString();

      execution.duration =
        finished -
        pipelineStartedAt;
    },

    failExecution() {
      const finished =
        Date.now();

      execution.currentStage =
        null;

      execution.completedAt =
        new Date(
          finished
        ).toISOString();

      execution.duration =
        finished -
        pipelineStartedAt;
    },

    snapshot() {
      return {
        ...execution,

        completedStages: [
          ...execution.completedStages,
        ],

        stageMetrics: [
          ...execution.stageMetrics,
        ],
      };
    },
  });
}

module.exports = {
  createPipelineExecutionState,
};