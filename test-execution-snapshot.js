// ======================================================
// Execution Snapshot Test
// ======================================================

const assert = require(
  "node:assert"
);

const {
  createPipelineExecutionSnapshot,
} = require(
  "./services/pipeline/execution-snapshot/executionSnapshot"
);

const {
  createPipelineExecutionRecord,
} = require(
  "./services/pipeline/execution-record/executionRecord"
);

// ======================================================
// Snapshot Test
// ======================================================

function testSnapshot() {
  const request = {
    pipelineName:
      "ai-generation",

    input: {
      platform:
        "facebook",

      type:
        "caption",

      topic:
        "Execution replay",

      provider:
        "openrouter",
    },

    endpoint:
      "/pipelines/ai-generation/execute",

    configuration: {
      executionId:
        "snapshot-original-001",

      metadata: {
        source:
          "unit-test",

        client:
          "powershell",
      },
    },
  };

  const snapshot =
    createPipelineExecutionSnapshot(
      request
    );

  assert.strictEqual(
    snapshot.pipelineName,
    "ai-generation"
  );

  assert.strictEqual(
    snapshot.input.topic,
    "Execution replay"
  );

  assert.strictEqual(
    snapshot.input.provider,
    "openrouter"
  );

  assert.strictEqual(
    snapshot.options.metadata.source,
    "unit-test"
  );

  assert.strictEqual(
    snapshot.options.executionId,
    undefined
  );
}

// ======================================================
// Record Integration Test
// ======================================================

function testRecordSnapshot() {
  const record =
    createPipelineExecutionRecord({
      context: {
        endpoint:
          "/pipelines/ai-generation/execute",

        workflow:
          "facebook caption",

        execution: {
          id:
            "snapshot-record-001",

          pipeline:
            "ai-generation",

          completedStages:
            [],

          stageMetrics:
            [],

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

          execution:
            {},
        },
      },

      request: {
        pipelineName:
          "ai-generation",

        input: {
          platform:
            "facebook",

          type:
            "caption",

          topic:
            "Snapshot integration",
        },

        endpoint:
          "/pipelines/ai-generation/execute",

        configuration: {
          executionId:
            "snapshot-record-001",

          metadata: {
            source:
              "unit-test",
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
    record.requestSnapshot
      .pipelineName,
    "ai-generation"
  );

  assert.strictEqual(
    record.requestSnapshot
      .input.topic,
    "Snapshot integration"
  );

  assert.strictEqual(
    record.requestSnapshot
      .options.metadata.source,
    "unit-test"
  );
}

// ======================================================
// Run
// ======================================================

function run() {
  testSnapshot();
  testRecordSnapshot();

  console.log(
    "Execution snapshot tests passed."
  );
}

run();