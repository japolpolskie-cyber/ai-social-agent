// ======================================================
// Pipeline Resolver Test
// ======================================================

const assert = require("node:assert");

const pipelineRegistry = require(
  "./services/pipeline/registry/pipelineRegistry"
);

const {
  resetPipelineRegistry,
} = require(
  "./services/pipeline/registry/bootstrapPipelineRegistry"
);

const {
  createPipelineResolver,
} = require(
  "./services/pipeline/resolution/pipelineResolver"
);

const {
  PipelineResolutionError,
} = require(
  "./services/pipeline/resolution/pipelineResolutionError"
);

// ======================================================
// Test Definitions
// ======================================================

const defaultPipeline = {
  name: "ai-generation",
  version: "1.0.0",
  stages: [],
};

const alternatePipeline = {
  name: "alternate-generation",
  version: "1.0.0",
  stages: [],
};

// ======================================================
// Tests
// ======================================================

function testDefaultResolution() {
  const resolver =
    createPipelineResolver({
      registry: pipelineRegistry,
      defaultPipelineName:
        "ai-generation",
    });

  const resolution =
    resolver.resolve();

  assert.strictEqual(
    resolution.requestedPipeline,
    null
  );

  assert.strictEqual(
    resolution.resolvedPipeline,
    "ai-generation"
  );

  assert.strictEqual(
    resolution.source,
    "default"
  );

  assert.strictEqual(
    resolution.definition,
    defaultPipeline
  );
}

function testRequestedResolution() {
  const resolver =
    createPipelineResolver({
      registry: pipelineRegistry,
      defaultPipelineName:
        "ai-generation",
    });

  const resolution =
    resolver.resolve({
      pipelineName:
        "alternate-generation",
    });

  assert.strictEqual(
    resolution.requestedPipeline,
    "alternate-generation"
  );

  assert.strictEqual(
    resolution.resolvedPipeline,
    "alternate-generation"
  );

  assert.strictEqual(
    resolution.source,
    "request"
  );

  assert.strictEqual(
    resolution.definition,
    alternatePipeline
  );
}

function testPipelineNameNormalization() {
  const resolver =
    createPipelineResolver({
      registry: pipelineRegistry,
      defaultPipelineName:
        " ai-generation ",
    });

  const resolution =
    resolver.resolve({
      pipelineName:
        " alternate-generation ",
    });

  assert.strictEqual(
    resolution.resolvedPipeline,
    "alternate-generation"
  );
}

function testUnknownPipeline() {
  const resolver =
    createPipelineResolver({
      registry: pipelineRegistry,
      defaultPipelineName:
        "ai-generation",
    });

  assert.throws(
    () => {
      resolver.resolve({
        pipelineName:
          "missing-pipeline",
      });
    },
    (error) => {
      assert.ok(
        error instanceof
          PipelineResolutionError
      );

      assert.strictEqual(
        error.code,
        "PIPELINE_RESOLUTION_ERROR"
      );

      assert.strictEqual(
        error.reason,
        "pipeline_not_registered"
      );

      assert.strictEqual(
        error.requestedPipeline,
        "missing-pipeline"
      );

      assert.strictEqual(
        error.resolvedPipeline,
        "missing-pipeline"
      );

      assert.deepStrictEqual(
        error.availablePipelines,
        [
          "ai-generation",
          "alternate-generation",
        ]
      );

      return true;
    }
  );
}

function testAvailablePipelineList() {
  const resolver =
    createPipelineResolver({
      registry: pipelineRegistry,
      defaultPipelineName:
        "ai-generation",
    });

  assert.deepStrictEqual(
    resolver.listAvailablePipelines(),
    [
      "ai-generation",
      "alternate-generation",
    ]
  );
}

// ======================================================
// Run
// ======================================================

function run() {
  resetPipelineRegistry();

  pipelineRegistry.register(
    defaultPipeline
  );

  pipelineRegistry.register(
    alternatePipeline
  );

  testDefaultResolution();
  testRequestedResolution();
  testPipelineNameNormalization();
  testUnknownPipeline();
  testAvailablePipelineList();

  resetPipelineRegistry();

  console.log(
    "Pipeline resolver tests passed."
  );
}

run();