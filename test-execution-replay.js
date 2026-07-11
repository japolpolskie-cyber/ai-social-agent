// ======================================================
// Execution Replay Test
// ======================================================

const assert = require(
  "node:assert"
);

const {
  createExecutionReplayRequest,
} = require(
  "./services/pipeline/replay/executionReplayRequest"
);

const {
  createExecutionReplayService,
} = require(
  "./services/pipeline/replay/executionReplayService"
);

// ======================================================
// Replay Request
// ======================================================

function testReplayRequest() {
  const replay =
    createExecutionReplayRequest({
      originalExecutionId:
        "original-execution-001",

      requestSnapshot: {
        pipelineName:
          "ai-generation",

        input: {
          platform:
            "facebook",

          type:
            "caption",

          topic:
            "Replay request test",

          provider:
            "openrouter",
        },

        endpoint:
          "/pipelines/ai-generation/execute",

        options: {
          metadata: {
            client:
              "powershell",

            source:
              "original-request",
          },
        },
      },

      metadata: {
        requestedBy:
          "unit-test",
      },
    });

  assert.strictEqual(
    replay.originalExecutionId,
    "original-execution-001"
  );

  assert.ok(
    replay.newExecutionId.startsWith(
      "replay-"
    )
  );

  assert.notStrictEqual(
    replay.newExecutionId,
    "original-execution-001"
  );

  assert.strictEqual(
    replay.request.input.topic,
    "Replay request test"
  );

  assert.strictEqual(
    replay.request.configuration
      .metadata.replayedFrom,
    "original-execution-001"
  );

  assert.strictEqual(
    replay.request.configuration
      .metadata.source,
    "replay"
  );

  assert.strictEqual(
    replay.request.configuration
      .metadata.client,
    "powershell"
  );

  assert.strictEqual(
    replay.request.configuration
      .metadata.requestedBy,
    "unit-test"
  );
}

// ======================================================
// Replay Service
// ======================================================

async function testReplayService() {
  let receivedRequest =
    null;

  const service =
    createExecutionReplayService({
      async getExecution(
        executionId
      ) {
        assert.strictEqual(
          executionId,
          "original-execution-001"
        );

        return {
          executionId,

          requestSnapshot: {
            pipelineName:
              "ai-generation",

            input: {
              platform:
                "facebook",

              type:
                "caption",

              topic:
                "Replay service test",
            },

            endpoint:
              "/pipelines/ai-generation/execute",

            options: {
              metadata: {
                source:
                  "original",
              },
            },
          },
        };
      },

      async executePipeline(
        request
      ) {
        receivedRequest =
          request;

        return {
          workflow:
            "facebook caption",

          meta: {
            executionId:
              request.configuration
                .executionId,

            pipeline:
              request.pipelineName,
          },
        };
      },
    });

  const replay =
    await service.replayExecution(
      "original-execution-001",
      {
        metadata: {
          requestedBy:
            "unit-test",
        },
      }
    );

  assert.strictEqual(
    replay.replayedFrom,
    "original-execution-001"
  );

  assert.strictEqual(
    replay.pipeline,
    "ai-generation"
  );

  assert.strictEqual(
    replay.newExecutionId,
    receivedRequest
      .configuration
      .executionId
  );

  assert.strictEqual(
    receivedRequest
      .configuration
      .metadata
      .replayedFrom,
    "original-execution-001"
  );

  assert.strictEqual(
    replay.result.meta.executionId,
    replay.newExecutionId
  );
}

// ======================================================
// Missing Execution
// ======================================================

async function testMissingExecution() {
  const service =
    createExecutionReplayService({
      async getExecution() {
        return null;
      },

      async executePipeline() {
        throw new Error(
          "Should not execute."
        );
      },
    });

  await assert.rejects(
    () =>
      service.replayExecution(
        "missing-execution"
      ),

    (error) => {
      assert.strictEqual(
        error.code,
        "EXECUTION_NOT_FOUND"
      );

      assert.strictEqual(
        error.statusCode,
        404
      );

      return true;
    }
  );
}

// ======================================================
// Missing Snapshot
// ======================================================

async function testMissingSnapshot() {
  const service =
    createExecutionReplayService({
      async getExecution() {
        return {
          executionId:
            "legacy-execution",
        };
      },

      async executePipeline() {
        throw new Error(
          "Should not execute."
        );
      },
    });

  await assert.rejects(
    () =>
      service.replayExecution(
        "legacy-execution"
      ),

    (error) => {
      assert.strictEqual(
        error.code,
        "EXECUTION_SNAPSHOT_UNAVAILABLE"
      );

      assert.strictEqual(
        error.statusCode,
        409
      );

      return true;
    }
  );
}

// ======================================================
// Run
// ======================================================

async function run() {
  testReplayRequest();

  await testReplayService();
  await testMissingExecution();
  await testMissingSnapshot();

  console.log(
    "Execution replay tests passed."
  );
}

run().catch(
  (error) => {
    console.error(
      "Execution replay tests failed."
    );

    console.error(error);

    process.exitCode = 1;
  }
);