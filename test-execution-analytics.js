// ======================================================
// Execution Analytics Test
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

const executionAnalyticsService =
  require(
    "./services/pipeline/analytics/executionAnalyticsService"
  );

// ======================================================
// Record Factory
// ======================================================

function createRecord({
  executionId,
  status,
  duration,
  provider,
  model,
  pipeline =
    "ai-generation",
}) {
  const timestamp =
    new Date().toISOString();

  return createExecutionRecord({
    executionId,

    pipeline,

    pipelineVersion:
      "1.0.0",

    status,

    endpoint:
      "/test",

    startedAt:
      timestamp,

    completedAt:
      timestamp,

    duration,

    completedStages:
      [],

    stageMetrics:
      [],

    metadata: {
      provider,
      model,
    },

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

// ======================================================
// Test
// ======================================================

async function run() {
  executionStore
    .resetExecutionStore();

  await executionStore.clear();

  await executionStore.save(
    createRecord({
      executionId:
        "analytics-1",

      status:
        "success",

      duration:
        100,

      provider:
        "openrouter",

      model:
        "openrouter-qwen",
    })
  );

  await executionStore.save(
    createRecord({
      executionId:
        "analytics-2",

      status:
        "success",

      duration:
        200,

      provider:
        "openrouter",

      model:
        "openrouter-qwen",
    })
  );

  await executionStore.save(
    createRecord({
      executionId:
        "analytics-3",

      status:
        "failed",

      duration:
        300,

      provider:
        "gemini",

      model:
        "gemini-flash",
    })
  );

  const stats =
    await executionAnalyticsService
      .getExecutionStatistics();

  assert.strictEqual(
    stats.total,
    3
  );

  assert.strictEqual(
    stats.success,
    2
  );

  assert.strictEqual(
    stats.failed,
    1
  );

  assert.strictEqual(
    stats.successRate,
    66.67
  );

  assert.strictEqual(
    stats.failureRate,
    33.33
  );

  assert.strictEqual(
    stats.averageDuration,
    200
  );

  assert.strictEqual(
    stats.providers
      .openrouter,
    2
  );

  assert.strictEqual(
    stats.providers
      .gemini,
    1
  );

  assert.strictEqual(
    stats.pipelines
      ["ai-generation"],
    3
  );

  console.log(
    "Execution analytics tests passed."
  );
}

run().catch(
  (error) => {
    console.error(
      "Execution analytics tests failed."
    );

    console.error(error);

    process.exitCode = 1;
  }
);