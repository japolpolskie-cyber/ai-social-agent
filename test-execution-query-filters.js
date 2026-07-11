// ======================================================
// Execution Query Filters Test
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

const queryService = require(
  "./services/pipeline/query/executionQueryService"
);

async function seed() {

  await executionStore.clear();

  await executionStore.save(
    createExecutionRecord({
      executionId:
        "history-1",

      pipeline:
        "ai-generation",

      pipelineVersion:
        "1.0.0",

      status:
        "success",

      endpoint:
        "/test",

      startedAt:
        new Date().toISOString(),

      completedAt:
        new Date().toISOString(),

      duration:
        100,

      completedStages:
        [],

      stageMetrics:
        [],

      metadata:
        {},
    })
  );

  await executionStore.save(
    createExecutionRecord({
      executionId:
        "history-2",

      pipeline:
        "ai-generation",

      pipelineVersion:
        "1.0.0",

      status:
        "failed",

      endpoint:
        "/test",

      startedAt:
        new Date().toISOString(),

      completedAt:
        new Date().toISOString(),

      duration:
        200,

      completedStages:
        [],

      stageMetrics:
        [],

      metadata:
        {},

      error: {
        code:
          "FAILED",
      },
    })
  );

}

async function run() {

  executionStore.resetExecutionStore();

  await seed();

  const failed =
    await queryService.getExecutionHistory(
      {
        status:
          "failed",
      }
    );

  assert.strictEqual(
    failed.total,
    1
  );

  assert.strictEqual(
    failed.executions[0]
      .status,
    "failed"
  );

  const limited =
    await queryService.getExecutionHistory(
      {
        limit:
          1,
      }
    );

  assert.strictEqual(
    limited.total,
    1
  );

  console.log(
    "Execution query filter tests passed."
  );

}

run().catch(
  console.error
);