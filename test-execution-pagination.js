// ======================================================
// Execution Pagination Test
// ======================================================

const assert = require(
  "node:assert"
);

const executionStore = require(
  "./services/pipeline/execution-store/executionStore"
);

const {
  createExecutionRecord,
} = require(
  "./services/pipeline/execution-record/createExecutionRecord"
);

const executionQueryService = require(
  "./services/pipeline/query/executionQueryService"
);

function createRecord(
  executionId,
  status
) {
  const timestamp =
    new Date().toISOString();

  return createExecutionRecord({
    executionId,

    pipeline:
      "ai-generation",

    pipelineVersion:
      "1.0.0",

    status,

    endpoint:
      "/test",

    startedAt:
      timestamp,

    completedAt:
      timestamp,

    duration:
      100,

    completedStages:
      [],

    stageMetrics:
      [],

    metadata:
      {},

    error:
      status === "failed"
        ? {
            code:
              "TEST_FAILURE",

            message:
              "Test failure.",

            stage:
              "test-stage",
          }
        : null,
  });
}

async function run() {
  executionStore
    .resetExecutionStore();

  await executionStore.clear();

  await executionStore.save(
    createRecord(
      "pagination-1",
      "success"
    )
  );

  await executionStore.save(
    createRecord(
      "pagination-2",
      "success"
    )
  );

  await executionStore.save(
    createRecord(
      "pagination-3",
      "failed"
    )
  );

  const firstPage =
    await executionQueryService
      .getExecutionHistory({
        limit:
          1,

        offset:
          0,

        status:
          "success",
      });

  assert.strictEqual(
    firstPage.total,
    2
  );

  assert.strictEqual(
    firstPage.count,
    1
  );

  assert.strictEqual(
    firstPage.hasMore,
    true
  );

  const secondPage =
    await executionQueryService
      .getExecutionHistory({
        limit:
          1,

        offset:
          1,

        status:
          "success",
      });

  assert.strictEqual(
    secondPage.total,
    2
  );

  assert.strictEqual(
    secondPage.count,
    1
  );

  assert.strictEqual(
    secondPage.hasMore,
    false
  );

  console.log(
    "Execution pagination tests passed."
  );
}

run().catch(
  (error) => {
    console.error(
      "Execution pagination tests failed."
    );

    console.error(error);

    process.exitCode = 1;
  }
);