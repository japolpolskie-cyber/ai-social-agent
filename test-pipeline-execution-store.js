// ======================================================
// Pipeline Execution Store Test
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

const {
  createRuntimeLifecycleManager,
} = require(
  "./services/pipeline/lifecycle/runtimeLifecycleManager"
);

// ======================================================
// Record Factory
// ======================================================

function createTestRecord({
  executionId,
  status = "success",
  pipeline = "ai-generation",
} = {}) {
  return createExecutionRecord({
    executionId,

    pipeline,

    pipelineVersion:
      "1.0.0",

    status,

    endpoint:
      "/test",

    startedAt:
      "2026-07-11T00:00:00.000Z",

    completedAt:
      "2026-07-11T00:00:01.000Z",

    duration:
      1000,

    completedStages:
      [],

    stageMetrics:
      [],

    metadata:
      {},

    requestSnapshot:
      null,

    error:
      status === "failed"
        ? {
            code:
              "TEST_FAILURE",

            message:
              "Test failed.",

            stage:
              "test-stage",
          }
        : null,
  });
}

// ======================================================
// Execution Request Factory
// ======================================================

function createTestExecutionRequest({
  executionId,
  metadata = {},
} = {}) {
  return {
    pipelineName:
      "ai-generation",

    input: {
      platform:
        "facebook",

      type:
        "caption",

      topic:
        "Pipeline execution store test",
    },

    endpoint:
      "/test",

    configuration: {
      executionId,

      metadata,
    },
  };
}

// ======================================================
// Store Contract
// ======================================================

async function testStoreContract() {
  await executionStore.clear();

  const successRecord =
    createTestRecord({
      executionId:
        "store-success-001",
    });

  const failedRecord =
    createTestRecord({
      executionId:
        "store-failed-001",

      status:
        "failed",
    });

  await executionStore.save(
    successRecord
  );

  await executionStore.save(
    failedRecord
  );

  assert.strictEqual(
    await executionStore.count(),
    2
  );

  assert.strictEqual(
    await executionStore.has(
      "store-success-001"
    ),
    true
  );

  const storedRecord =
    await executionStore.get(
      "store-success-001"
    );

  assert.strictEqual(
    storedRecord.executionId,
    "store-success-001"
  );

  assert.strictEqual(
    storedRecord.pipeline,
    "ai-generation"
  );

  assert.strictEqual(
    storedRecord.status,
    "success"
  );

  const failedRecords =
    await executionStore.list({
      status:
        "failed",
    });

  assert.strictEqual(
    failedRecords.length,
    1
  );

  assert.strictEqual(
    failedRecords[0].status,
    "failed"
  );

  assert.strictEqual(
    failedRecords[0].error.code,
    "TEST_FAILURE"
  );

  assert.strictEqual(
    await executionStore.remove(
      "store-success-001"
    ),
    true
  );

  assert.strictEqual(
    await executionStore.count(),
    1
  );

  await executionStore.clear();

  assert.strictEqual(
    await executionStore.count(),
    0
  );
}

// ======================================================
// Lifecycle Integration
// ======================================================

async function testLifecycleIntegration() {
  await executionStore.clear();

  const context = {
    endpoint:
      "/test",

    execution: {
      id:
        "lifecycle-store-001",

      pipeline:
        null,

      currentStage:
        null,

      completedStages:
        [],

      stageMetrics:
        [],

      startedAt:
        null,

      completedAt:
        null,

      duration:
        0,
    },

    metadata: {
      executionId:
        "lifecycle-store-001",

      execution: {
        source:
          "unit-test",
      },

      pipelineVersion:
        "1.0.0",
    },
  };

  const runtime = {
    async initialize() {},

    async beforeExecution() {},

    async afterExecution() {},

    async cleanup() {},

    createResult() {
      return {
        success:
          true,
      };
    },
  };

  const runner = {
    async run({
      name,
      context:
        pipelineContext,
    }) {
      pipelineContext.execution.pipeline =
        name;

      pipelineContext.execution.startedAt =
        "2026-07-11T00:00:00.000Z";

      pipelineContext.execution.completedAt =
        "2026-07-11T00:00:01.000Z";

      pipelineContext.execution.duration =
        1000;

      pipelineContext.execution.completedStages = [
        "test-stage",
      ];

      pipelineContext.execution.stageMetrics = [
        {
          stage:
            "test-stage",

          status:
            "success",

          duration:
            1000,

          startedAt:
            "2026-07-11T00:00:00.000Z",

          completedAt:
            "2026-07-11T00:00:01.000Z",
        },
      ];

      return pipelineContext;
    },
  };

  const manager =
    createRuntimeLifecycleManager({
      runtime,

      runner,
    });

  const request =
    createTestExecutionRequest({
      executionId:
        "lifecycle-store-001",

      metadata: {
        source:
          "unit-test",
      },
    });

  await manager.run({
    definition: {
      name:
        "ai-generation",

      version:
        "1.0.0",

      stages:
        [],
    },

    context,

    request,

    resolution: {
      resolvedPipeline:
        "ai-generation",

      definition: {
        version:
          "1.0.0",
      },
    },
  });

  assert.strictEqual(
    await executionStore.has(
      "lifecycle-store-001"
    ),
    true
  );

  const record =
    await executionStore.get(
      "lifecycle-store-001"
    );

  assert.strictEqual(
    record.status,
    "success"
  );

  assert.strictEqual(
    record.pipeline,
    "ai-generation"
  );

  assert.strictEqual(
    record.pipelineVersion,
    "1.0.0"
  );

  assert.strictEqual(
    record.duration,
    1000
  );

  assert.strictEqual(
    record.completedStages.length,
    1
  );

  assert.strictEqual(
    record.stageMetrics.length,
    1
  );

  assert.strictEqual(
    record.metadata.source,
    "unit-test"
  );

  assert.ok(
    record.requestSnapshot
  );

  assert.strictEqual(
    record.requestSnapshot.pipelineName,
    "ai-generation"
  );

  assert.strictEqual(
    record.requestSnapshot.input.platform,
    "facebook"
  );

  assert.strictEqual(
    record.requestSnapshot.input.type,
    "caption"
  );

  assert.strictEqual(
    record.requestSnapshot.input.topic,
    "Pipeline execution store test"
  );

  assert.strictEqual(
    record.requestSnapshot.endpoint,
    "/test"
  );

  assert.deepStrictEqual(
    record.requestSnapshot.options.metadata,
    {
      source:
        "unit-test",
    }
  );

  await executionStore.clear();
}

// ======================================================
// Run
// ======================================================

async function run() {
  executionStore
    .resetExecutionStore();

  await testStoreContract();

  await testLifecycleIntegration();

  console.log(
    "Pipeline execution store tests passed."
  );
}

run().catch(
  (error) => {
    console.error(
      "Pipeline execution store tests failed."
    );

    console.error(
      error
    );

    process.exitCode =
      1;
  }
);