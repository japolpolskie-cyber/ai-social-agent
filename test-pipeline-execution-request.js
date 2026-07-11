// ======================================================
// Pipeline Execution Request Test
// ======================================================

const {
  createPipelineExecutionRequest,
} = require(
  "./services/pipeline/execution/pipelineExecutionRequest"
);

function runTest() {
  const request =
    createPipelineExecutionRequest({
      pipelineName:
        "ai-generation",

      input: {
        platform:
          "facebook",

        type:
          "caption",

        topic:
          "AI automation for small businesses",
      },

      endpoint:
        "/pipelines/ai-generation/execute",

      options: {
        executionId:
          "execution-test-001",

        metadata: {
          source:
            "manual-test",

          requestedBy:
            "developer",
        },
      },
    });

  console.log(
    JSON.stringify(
      request,
      null,
      2
    )
  );

  console.log(
    "\n✅ Pipeline execution request created."
  );
}

try {
  runTest();
} catch (error) {
  console.error(
    "\n❌ Pipeline execution request failed."
  );

  console.error(
    typeof error.toJSON === "function"
      ? error.toJSON()
      : error
  );

  process.exitCode = 1;
}