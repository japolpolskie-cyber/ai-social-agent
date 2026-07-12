// ======================================================
// Pipeline Execution Record Test
// ======================================================

const assert = require(
  "node:assert"
);

const {
  createPipelineExecutionRecord,
} = require(
  "./services/pipeline/execution-record/executionRecord"
);

// ======================================================
// Request Factory
// ======================================================

function createTestRequest({
  executionId,
  metadata = {},
  topic,
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
        topic ||
        "Pipeline execution record test",
    },

    endpoint:
      "/pipelines/ai-generation/execute",

    configuration: {
      executionId,

      metadata,
    },
  };
}

// ======================================================
// Resolution Factory
// ======================================================

function createTestResolution() {
  return {
    resolvedPipeline:
      "ai-generation",

    definition: {
      version:
        "1.0.0",
    },
  };
}

// ======================================================
// Success Record
// ======================================================

function testSuccessRecord() {
  const context = {
    endpoint:
      "/pipelines/ai-generation/execute",

    execution: {
      id:
        "record-test-success",

      pipeline:
        "ai-generation",

      completedStages: [
        "validate-input",
        "build-context",
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

      startedAt:
        "2026-07-11T00:00:00.000Z",

      completedAt:
        "2026-07-11T00:00:01.000Z",

      duration:
        1000,
    },

    metadata: {
      pipelineVersion:
        "1.0.0",

      execution: {
        source:
          "unit-test",
      },
    },
  };

  const request =
    createTestRequest({
      executionId:
        "record-test-success",

      metadata: {
        client:
          "local",
      },

      topic:
        "Successful execution record",
    });

  const record =
    createPipelineExecutionRecord({
      context,

      request,

      resolution:
        createTestResolution(),
    });

  assert.strictEqual(
    record.status,
    "success"
  );

  assert.strictEqual(
    record.executionId,
    "record-test-success"
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
    record.endpoint,
    "/pipelines/ai-generation/execute"
  );

  assert.strictEqual(
    record.duration,
    1000
  );

  assert.strictEqual(
    record.completedStages.length,
    2
  );

  assert.strictEqual(
    record.stageMetrics.length,
    1
  );

  assert.strictEqual(
    record.metadata.client,
    "local"
  );

  assert.strictEqual(
    record.metadata.source,
    "unit-test"
  );

  assert.strictEqual(
    record.error,
    null
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
    "Successful execution record"
  );

  assert.strictEqual(
    record.requestSnapshot.endpoint,
    "/pipelines/ai-generation/execute"
  );

  assert.deepStrictEqual(
    record.requestSnapshot.options.metadata,
    {
      client:
        "local",
    }
  );

  assert.ok(
    Object.isFrozen(
      record.requestSnapshot
    )
  );

  assert.ok(
    Object.isFrozen(
      record.requestSnapshot.input
    )
  );

  assert.ok(
    Object.isFrozen(
      record.requestSnapshot.options
    )
  );
}

// ======================================================
// Failed Record
// ======================================================

function testFailedRecord() {
  const error =
    new Error(
      "Topic is required."
    );

  error.code =
    "PIPELINE_STAGE_FAILED";

  error.stage =
    "validate-input";

  const request =
    createTestRequest({
      executionId:
        "record-test-failed",

      metadata: {
        source:
          "failure-test",
      },

      topic:
        "Failed execution record",
    });

  const record =
    createPipelineExecutionRecord({
      context: {
        endpoint:
          "/pipelines/ai-generation/execute",

        execution: {
          id:
            "record-test-failed",

          pipeline:
            "ai-generation",

          completedStages:
            [],

          stageMetrics:
            [],

          startedAt:
            "2026-07-11T00:00:00.000Z",

          completedAt:
            "2026-07-11T00:00:00.100Z",

          duration:
            100,
        },

        metadata: {
          pipelineVersion:
            "1.0.0",

          execution:
            {},
        },
      },

      request,

      resolution:
        createTestResolution(),

      error,
    });

  assert.strictEqual(
    record.status,
    "failed"
  );

  assert.strictEqual(
    record.executionId,
    "record-test-failed"
  );

  assert.strictEqual(
    record.pipeline,
    "ai-generation"
  );

  assert.strictEqual(
    record.duration,
    100
  );

  assert.strictEqual(
    record.error.code,
    "PIPELINE_STAGE_FAILED"
  );

  assert.strictEqual(
    record.error.stage,
    "validate-input"
  );

  assert.ok(
    record.requestSnapshot
  );

  assert.strictEqual(
    record.requestSnapshot.pipelineName,
    "ai-generation"
  );

  assert.strictEqual(
    record.requestSnapshot.input.topic,
    "Failed execution record"
  );

  assert.deepStrictEqual(
    record.requestSnapshot.options.metadata,
    {
      source:
        "failure-test",
    }
  );
}

// ======================================================
// Missing Request
// ======================================================

function testMissingRequest() {
  const record =
    createPipelineExecutionRecord({
      context: {
        endpoint:
          "/pipelines/ai-generation/execute",

        execution: {
          id:
            "record-test-no-request",

          pipeline:
            "ai-generation",

          completedStages:
            [],

          stageMetrics:
            [],

          startedAt:
            "2026-07-11T00:00:00.000Z",

          completedAt:
            "2026-07-11T00:00:00.050Z",

          duration:
            50,
        },

        metadata: {
          pipelineVersion:
            "1.0.0",

          execution:
            {},
        },
      },

      request:
        null,

      resolution:
        createTestResolution(),
    });

  assert.strictEqual(
    record.requestSnapshot,
    null
  );
}

// ======================================================
// Run
// ======================================================

function run() {
  testSuccessRecord();

  testFailedRecord();

  testMissingRequest();

  console.log(
    "Pipeline execution record tests passed."
  );
}

run();