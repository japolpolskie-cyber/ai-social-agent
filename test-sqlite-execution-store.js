// ======================================================
// SQLite Execution Store Test
// ======================================================

const assert =
  require(
    "node:assert"
  );

const {
  createSQLiteExecutionStore,
} = require(
  "./services/pipeline/execution-store/sqliteExecutionStore"
);

const {
  createExecutionRecord,
} = require(
  "./services/pipeline/execution-record/createExecutionRecord"
);

async function run() {

  const store =
    createSQLiteExecutionStore();

  await store.clear();

  const record =
    createExecutionRecord({
      executionId:
        "sqlite-store-test",

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
        123,

      completedStages:
        [
          "validate-input",
        ],

      stageMetrics:
        [],

      metadata:
        {
          source:
            "unit-test",
        },
    });

  await store.save(
    record
  );

  assert.strictEqual(
    await store.count(),
    1
  );

  const loaded =
    await store.get(
      "sqlite-store-test"
    );

  assert.strictEqual(
    loaded.executionId,
    "sqlite-store-test"
  );

  assert.strictEqual(
    loaded.pipeline,
    "ai-generation"
  );

  assert.strictEqual(
    loaded.status,
    "success"
  );

  await store.remove(
    "sqlite-store-test"
  );

  assert.strictEqual(
    await store.count(),
    0
  );

  console.log(
    "SQLite execution store tests passed."
  );

}

run().catch(
  console.error
);