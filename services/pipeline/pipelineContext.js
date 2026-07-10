// ======================================================
// AI Pipeline Context
// ======================================================

function createPipelineContext(input = {}) {
  return {
    input,

    workflow: "",
    endpoint: "",

    contentContext: null,
    route: null,
    prompt: null,

    execution: {
      pipeline: null,

      currentStage: null,

      completedStages: [],

      stageMetrics: [],

      startedAt: null,

      completedAt: null,

      duration: 0,
    },

    aiExecution: null,

    processed: null,

    metadata: {
      pipelineVersion: "1.0.0",

      startedAt: new Date().toISOString(),

      completedAt: null,

      duration: 0,
    },
  };
}

module.exports = {
  createPipelineContext,
};