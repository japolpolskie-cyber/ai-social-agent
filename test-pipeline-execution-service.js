// ======================================================
// Pipeline Execution Service Test
// ======================================================

const assert = require(
  "node:assert"
);

const pipelineExecutionService =
  require(
    "./services/pipeline/execution/pipelineExecutionService"
  );

// ======================================================
// Execute Integration
// ======================================================

async function testExecute() {
  const result =
    await pipelineExecutionService.execute({
      pipelineName:
        "ai-generation",

      input: {
        platform:
          "facebook",

        type:
          "caption",

        topic:
          "Pipeline Execution Service",
      },

      configuration: {
        executionId:
          "execution-service-test-001",

        metadata: {
          source:
            "sprint-42",
        },
      },
    });

  assert.strictEqual(
    result.meta.executionId,
    "execution-service-test-001"
  );

  assert.strictEqual(
    result.meta.pipeline,
    "ai-generation"
  );
}

// ======================================================
// Alias Contract
// ======================================================

function testAliases() {
  assert.strictEqual(
    typeof pipelineExecutionService
      .executePipeline,
    "function"
  );

  assert.strictEqual(
    typeof pipelineExecutionService
      .executeRequest,
    "function"
  );
}

// ======================================================
// Invalid Request
// ======================================================

async function testInvalidRequest() {
  await assert.rejects(
    () =>
      pipelineExecutionService.execute(
        {}
      ),

    (error) => {
      assert.ok(
        error instanceof TypeError
      );

      return true;
    }
  );
}

// ======================================================
// Run
// ======================================================

async function run() {
  testAliases();

  await testInvalidRequest();

  await testExecute();

  console.log(
    "Pipeline execution service tests passed."
  );
}

run().catch(
  (error) => {
    console.error(
      "Pipeline execution service tests failed."
    );

    console.error(error);

    process.exitCode = 1;
  }
);