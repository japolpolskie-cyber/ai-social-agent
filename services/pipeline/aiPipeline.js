// ======================================================
// AI Pipeline
// ======================================================

const pipelineExecutor = require(
  "./pipelineExecutor"
);

// ======================================================
// Pipeline Identity
// ======================================================

const AI_GENERATION_PIPELINE =
  "ai-generation";

// ======================================================
// Execute
// ======================================================

async function execute(input = {}) {
  return pipelineExecutor.execute({
    pipelineName:
      input.pipeline ||
      AI_GENERATION_PIPELINE,

    input,

    endpoint:
      input.endpoint ||
      "/ai/generate",

    options: {
      executionId:
        input.executionId ||
        null,

      metadata: {
        source:
          "ai-api",
      },
    },
  });
}

module.exports = {
  execute,
};