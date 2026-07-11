// ======================================================
// AI Pipeline Context
// ======================================================

const {
  createPipelineAIContext,
} = require(
  "./ai-context/aiContext"
);

function createPipelineContext(input = {}) {
  return {
    input,

    workflow:
      "",

    endpoint:
      "",

    ai:
      createPipelineAIContext(),

    execution: {
      id:
        null,

      pipeline:
        null,

      currentStage:
        null,

      completedStages:
        [],

      stageMetrics:
        [],

      startedAt:
        null,

      completedAt:
        null,

      duration:
        0,
    },

    executionRecord:
      null,

    metadata: {
      executionId:
        null,

      execution:
        {},

      pipelineVersion:
        "1.0.0",

      pipeline:
        null,

      startedAt:
        new Date().toISOString(),

      completedAt:
        null,

      duration:
        0,
    },
  };
}

module.exports = {
  createPipelineContext,
};