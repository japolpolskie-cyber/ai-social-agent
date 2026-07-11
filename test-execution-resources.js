// ======================================================
// Execution Resources Test
// ======================================================

const assert = require(
  "node:assert"
);

const {
  createExecutionResource,
} = require(
  "./services/pipeline/resources/executionResource"
);

const {
  createExecutionCollectionResource,
} = require(
  "./services/pipeline/resources/executionCollectionResource"
);

function createRecord(
  executionId
) {
  return {
    executionId,

    pipeline:
      "ai-generation",

    pipelineVersion:
      "1.0.0",

    status:
      "success",

    endpoint:
      "/test",

    startedAt:
      "2026-07-11T00:00:00.000Z",

    completedAt:
      "2026-07-11T00:00:01.000Z",

    duration:
      1000,

    completedStages: [
      "validate-input",
    ],

    stageMetrics: [
      {
        stage:
          "validate-input",

        status:
          "success",

        duration:
          1,
      },
    ],

    metadata: {
      source:
        "unit-test",
    },

    error:
      null,
  };
}

function run() {
  const execution =
    createExecutionResource(
      createRecord(
        "resource-test-001"
      )
    );

  assert.strictEqual(
    execution.executionId,
    "resource-test-001"
  );

  assert.strictEqual(
    execution.pipeline,
    "ai-generation"
  );

  const collection =
    createExecutionCollectionResource({
      total:
        1,

      executions: [
        createRecord(
          "resource-test-001"
        ),
      ],

      query: {
        status:
          "success",

        limit:
          10,

        offset:
          0,
      },
    });

  assert.strictEqual(
    collection.total,
    1
  );

  assert.strictEqual(
    collection.query.status,
    "success"
  );

  assert.strictEqual(
    collection.executions.length,
    1
  );

  console.log(
    "Execution resource tests passed."
  );
}

run();