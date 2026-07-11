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

  const record =
    createPipelineExecutionRecord({
      context,

      request: {
        configuration: {
          executionId:
            "record-test-success",

          metadata: {
            client:
              "local",
          },
        },
      },

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
    record.completedStages.length,
    2
  );

  assert.strictEqual(
    record.error,
    null
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

      request: {
        configuration: {
          executionId:
            "record-test-failed",

          metadata:
            {},
        },
      },

      resolution: {
        resolvedPipeline:
          "ai-generation",

        definition: {
          version:
            "1.0.0",
        },
      },

      error,
    });

  assert.strictEqual(
    record.status,
    "failed"
  );

  assert.strictEqual(
    record.error.code,
    "PIPELINE_STAGE_FAILED"
  );

  assert.strictEqual(
    record.error.stage,
    "validate-input"
  );
}

// ======================================================
// Run
// ======================================================

function run() {
  testSuccessRecord();
  testFailedRecord();

  console.log(
    "Pipeline execution record tests passed."
  );
}

run();