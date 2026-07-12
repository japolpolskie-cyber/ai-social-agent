// ======================================================
// Pipeline Metadata Test
// ======================================================

const assert = require(
  "node:assert"
);

const {
  createPipelineMetadata,
} = require(
  "./services/pipeline/models/pipelineMetadata"
);

const {
  createPipelineDefinition,
} = require(
  "./services/pipeline/definitions/createPipelineDefinition"
);

// ======================================================
// Test Runtime
// ======================================================

const testRuntime = {
  createContext(input) {
    return {
      input,
    };
  },

  initialize(context) {
    return context;
  },

  beforeExecution(context) {
    return context;
  },

  afterExecution(
    context,
    result
  ) {
    return {
      context,
      result,
    };
  },

  createResult(context) {
    return {
      context,
    };
  },

  cleanup(context) {
    return context;
  },
};

// ======================================================
// Test Stage
// ======================================================

const testStage = {
  name:
    "test-stage",

  async execute() {},
};

// ======================================================
// Tests
// ======================================================

function testDefaultMetadata() {
  const metadata =
    createPipelineMetadata();

  assert.deepStrictEqual(
    metadata,
    {
      category:
        "general",

      tags:
        [],

      reusable:
        false,

      experimental:
        false,

      deprecated:
        false,

      visibility:
        "internal",
    }
  );

  assert.ok(
    Object.isFrozen(
      metadata
    )
  );

  assert.ok(
    Object.isFrozen(
      metadata.tags
    )
  );
}

function testCustomMetadata() {
  const metadata =
    createPipelineMetadata({
      category:
        "content-generation",

      tags: [
        "ai",
        "generation",
        "ai",
      ],

      reusable:
        true,

      experimental:
        false,

      deprecated:
        false,

      visibility:
        "public",
    });

  assert.deepStrictEqual(
    metadata,
    {
      category:
        "content-generation",

      tags: [
        "ai",
        "generation",
      ],

      reusable:
        true,

      experimental:
        false,

      deprecated:
        false,

      visibility:
        "public",
    }
  );
}

function testInvalidVisibility() {
  assert.throws(
    () => {
      createPipelineMetadata({
        visibility:
          "external",
      });
    },

    TypeError
  );
}

function testInvalidTags() {
  assert.throws(
    () => {
      createPipelineMetadata({
        tags: [
          "ai",
          "",
        ],
      });
    },

    TypeError
  );

  assert.throws(
    () => {
      createPipelineMetadata({
        tags:
          "ai",
      });
    },

    TypeError
  );
}

function testInvalidFlags() {
  assert.throws(
    () => {
      createPipelineMetadata({
        reusable:
          "true",
      });
    },

    TypeError
  );
}

function testDefinitionIntegration() {
  const definition =
    createPipelineDefinition({
      name:
        "test-pipeline",

      version:
        "1.0.0",

      description:
        " Test pipeline. ",

      metadata: {
        category:
          "testing",

        tags: [
          "test",
        ],

        reusable:
          true,
      },

      runtime:
        testRuntime,

      stages: [
        testStage,
      ],
    });

  assert.strictEqual(
    definition.description,
    "Test pipeline."
  );

  assert.strictEqual(
    definition.metadata.category,
    "testing"
  );

  assert.deepStrictEqual(
    definition.metadata.tags,
    [
      "test",
    ]
  );

  assert.strictEqual(
    definition.metadata.reusable,
    true
  );

  assert.strictEqual(
    definition.runtime,
    testRuntime
  );

  assert.ok(
    Object.isFrozen(
      definition
    )
  );

  assert.ok(
    Object.isFrozen(
      definition.metadata
    )
  );
}

// ======================================================
// Run
// ======================================================

function run() {
  testDefaultMetadata();

  testCustomMetadata();

  testInvalidVisibility();

  testInvalidTags();

  testInvalidFlags();

  testDefinitionIntegration();

  console.log(
    "Pipeline metadata tests passed."
  );
}

run();