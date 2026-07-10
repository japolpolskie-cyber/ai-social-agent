// ======================================================
// Pipeline Error Test
// ======================================================

const PipelineError = require("./services/pipeline/pipelineError");

function runTest() {
  try {
    throw new Error("Provider connection failed.");
  } catch (error) {
    const pipelineError = PipelineError.wrap(error, {
      code: "AI_EXECUTION_FAILED",
      message: "AI provider execution failed.",
      stage: "execute-ai",
      statusCode: 502,
    });

    console.log("Pipeline Error:");
    console.log(pipelineError.toJSON());

    console.log("\nMetadata:");
    console.log({
      name: pipelineError.name,
      statusCode: pipelineError.statusCode,
      hasCause: Boolean(pipelineError.cause),
      isPipelineError: PipelineError.isPipelineError(pipelineError),
    });
  }
}

runTest();