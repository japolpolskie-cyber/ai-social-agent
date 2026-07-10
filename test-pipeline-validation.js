// ======================================================
// AI Pipeline Validation Failure Test
// ======================================================

require("dotenv").config();

const aiPipeline = require(
  "./services/pipeline/aiPipeline"
);

const PipelineError = require(
  "./services/pipeline/pipelineError"
);

async function runTest() {
  try {
    await aiPipeline.execute({
      platform: "facebook",
      type: "caption",
      endpoint: "/test/pipeline-validation",

      // Intentionally missing topic
    });

    console.error(
      "Test failed: pipeline should have thrown an error."
    );

    process.exitCode = 1;
  } catch (error) {
    console.log("=== VALIDATION FAILURE TEST ===");

    console.log("\nError:");
    console.log(
      typeof error.toJSON === "function"
        ? error.toJSON()
        : error
    );

    console.log("\nError Metadata:");
    console.log({
      name: error.name,
      code: error.code,
      stage: error.stage,
      statusCode: error.statusCode,
      isPipelineError:
        PipelineError.isPipelineError(error),
      hasCause: Boolean(error.cause),
    });
  }
}

runTest().catch((error) => {
  console.error(
    "Pipeline Validation Test Failed:"
  );

  console.error(error);

  process.exitCode = 1;
});