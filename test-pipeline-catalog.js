// ======================================================
// Pipeline Catalog Test
// ======================================================

const assert = require(
  "node:assert"
);

const pipelineRegistry = require(
  "./services/pipeline/registry/pipelineRegistry"
);

const {
  resetPipelineRegistry,
} = require(
  "./services/pipeline/registry/bootstrapPipelineRegistry"
);

const {
  createPipelineDefinition,
} = require(
  "./services/pipeline/definitions/createPipelineDefinition"
);

const {
  createPipelineCatalog,
} = require(
  "./services/pipeline/catalog/pipelineCatalog"
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
// Test Stages
// ======================================================

const testStage = {
  name:
    "test-stage",

  async execute() {},
};

const secondTestStage = {
  name:
    "second-test-stage",

  async execute() {},
};

// ======================================================
// Test Definitions
// ======================================================

const aiPipeline =
  createPipelineDefinition({
    name:
      "ai-generation",

    version:
      "1.0.0",

    description:
      "Generates AI content.",

    metadata: {
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
        "internal",
    },

    runtime:
      testRuntime,

    stages: [
      testStage,
    ],
  });

const seoPipeline =
  createPipelineDefinition({
    name:
      "seo-generation",

    version:
      "1.0.0",

    description:
      "Generates SEO content.",

    metadata: {
      category:
        "content-generation",

      tags: [
        "seo",
        "generation",
      ],

      reusable:
        true,

      experimental:
        true,

      deprecated:
        false,

      visibility:
        "private",
    },

    runtime:
      testRuntime,

    stages: [
      testStage,
      secondTestStage,
    ],
  });

// ======================================================
// Tests
// ======================================================

function testList(
  catalog
) {
  const summaries =
    catalog.list();

  assert.strictEqual(
    summaries.length,
    2
  );

  assert.deepStrictEqual(
    summaries.map(
      (summary) =>
        summary.name
    ),
    [
      "ai-generation",
      "seo-generation",
    ]
  );

  assert.ok(
    Object.isFrozen(
      summaries
    )
  );
}

function testGet(
  catalog
) {
  const summary =
    catalog.get(
      "ai-generation"
    );

  assert.deepStrictEqual(
    summary,
    {
      name:
        "ai-generation",

      version:
        "1.0.0",

      description:
        "Generates AI content.",

      category:
        "content-generation",

      tags: [
        "ai",
        "generation",
      ],

      stageCount:
        1,

      reusable:
        true,

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
      summary
    )
  );

  assert.ok(
    Object.isFrozen(
      summary.tags
    )
  );
}

function testMissingPipeline(
  catalog
) {
  assert.strictEqual(
    catalog.get(
      "missing-pipeline"
    ),
    null
  );

  assert.strictEqual(
    catalog.exists(
      "missing-pipeline"
    ),
    false
  );
}

function testExists(
  catalog
) {
  assert.strictEqual(
    catalog.exists(
      "ai-generation"
    ),
    true
  );

  assert.strictEqual(
    catalog.exists(
      " seo-generation "
    ),
    true
  );
}

function testListNames(
  catalog
) {
  const names =
    catalog.listNames();

  assert.deepStrictEqual(
    names,
    [
      "ai-generation",
      "seo-generation",
    ]
  );

  assert.ok(
    Object.isFrozen(
      names
    )
  );
}

function testStageCount(
  catalog
) {
  const summary =
    catalog.get(
      "seo-generation"
    );

  assert.strictEqual(
    summary.stageCount,
    2
  );

  assert.strictEqual(
    summary.experimental,
    true
  );

  assert.strictEqual(
    summary.visibility,
    "private"
  );
}

// ======================================================
// Run
// ======================================================

function run() {
  resetPipelineRegistry();

  pipelineRegistry.register(
    aiPipeline
  );

  pipelineRegistry.register(
    seoPipeline
  );

  const catalog =
    createPipelineCatalog({
      registry:
        pipelineRegistry,
    });

  testList(
    catalog
  );

  testGet(
    catalog
  );

  testMissingPipeline(
    catalog
  );

  testExists(
    catalog
  );

  testListNames(
    catalog
  );

  testStageCount(
    catalog
  );

  resetPipelineRegistry();

  console.log(
    "Pipeline catalog tests passed."
  );
}

run();