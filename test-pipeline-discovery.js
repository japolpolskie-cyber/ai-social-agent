// ======================================================
// Pipeline Discovery Test
// ======================================================

const assert = require("node:assert");

const pipelineDiscoveryService = require(
  "./services/pipeline/pipelineDiscoveryService"
);

const {
  resetPipelineRegistry,
} = require(
  "./services/pipeline/registry/bootstrapPipelineRegistry"
);

// ======================================================
// Tests
// ======================================================

function testGetAllPipelines() {
  const result =
    pipelineDiscoveryService.getAllPipelines();

  assert.strictEqual(
    typeof result,
    "object"
  );

  assert.strictEqual(
    result.count,
    1
  );

  assert.ok(
    Array.isArray(result.pipelines)
  );

  assert.strictEqual(
    result.pipelines[0].name,
    "ai-generation"
  );

  assert.strictEqual(
    result.pipelines[0].version,
    "1.0.0"
  );

  assert.strictEqual(
    result.pipelines[0].stageCount,
    6
  );
}

function testGetPipelineByName() {
  const result =
    pipelineDiscoveryService.getPipelineByName(
      "ai-generation"
    );

  assert.strictEqual(
    result.pipeline.name,
    "ai-generation"
  );

  assert.strictEqual(
    result.pipeline.category,
    "content-generation"
  );

  assert.strictEqual(
    result.pipeline.reusable,
    true
  );
}

function testMissingPipeline() {
  assert.throws(
    () => {
      pipelineDiscoveryService.getPipelineByName(
        "missing-pipeline"
      );
    },
    (error) => {
      assert.strictEqual(
        error.name,
        "PipelineNotFoundError"
      );

      assert.strictEqual(
        error.code,
        "PIPELINE_NOT_FOUND"
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
// Run
// ======================================================

function run() {
  resetPipelineRegistry();

  testGetAllPipelines();
  testGetPipelineByName();
  testMissingPipeline();

  resetPipelineRegistry();

  console.log(
    "Pipeline discovery tests passed."
  );
}

run();