// ======================================================
// Execution Query Service Test
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

async function run() {
  executionStore.resetExecutionStore();

  await executionStore.clear();

  const record =
    createExecutionRecord({
      executionId:
        "query-test-001",

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
        150,

      completedStages:
        [],

      stageMetrics:
        [],

      metadata:
        {},

      error:
        null,
    });

  await executionStore.save(
    record
  );

  const execution =
    await queryService.getExecution(
      "query-test-001"
    );

  assert.strictEqual(
    execution.executionId,
    "query-test-001"
  );

  const history =
    await queryService.getExecutionHistory();

  assert.strictEqual(
    history.total,
    1
  );

  assert.strictEqual(
    history.executions[0]
      .executionId,
    "query-test-001"
  );

  const count =
    await queryService.countExecutions();

  assert.strictEqual(
    count,
    1
  );

  console.log(
    "Execution query service tests passed."
  );

}

run().catch(
  console.error
);