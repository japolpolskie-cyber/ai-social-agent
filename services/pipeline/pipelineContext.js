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

    execution: null,
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