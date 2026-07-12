// ======================================================
// Pipeline Registry Test
// ======================================================

const pipelineRegistry = require(
  "./services/pipeline/registry/pipelineRegistry"
);

const {
  createPipelineDefinition,
} = require(
  "./services/pipeline/definitions/createPipelineDefinition"
);

const {
  bootstrapPipelineRegistry,
  isPipelineRegistryBootstrapped,
  resetPipelineRegistry,
} = require(
  "./services/pipeline/registry/bootstrapPipelineRegistry"
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
// Test Definition
// ======================================================

const testStage = {
  name:
    "registry-test-stage",

  execute(context) {
    return context;
  },
};

const testDefinition =
  createPipelineDefinition({
    name:
      "registry-test",

    version:
      "1.0.0",

    description:
      "Registry behavior test.",

    runtime:
      testRuntime,

    stages: [
      testStage,
    ],

    metadata: {
      category:
        "test",
    },
  });

// ======================================================
// Test
// ======================================================

function runTest() {
  resetPipelineRegistry();

  const registerResult =
    pipelineRegistry.register(
      testDefinition
    );

  const registerValid =
    registerResult ===
    testDefinition;

  const getValid =
    pipelineRegistry.get(
      "registry-test"
    ) ===
    testDefinition;

  const hasValid =
    pipelineRegistry.has(
      "registry-test"
    );

  const registeredDefinitions =
    pipelineRegistry.list();

  const listValid =
    registeredDefinitions.length ===
      1 &&
    registeredDefinitions[0] ===
      testDefinition;

  let duplicateProtectionValid =
    false;

  try {
    pipelineRegistry.register(
      testDefinition
    );
  } catch (error) {
    duplicateProtectionValid =
      error.message ===
      'Pipeline "registry-test" is already registered.';
  }

  const unregisterValid =
    pipelineRegistry.unregister(
      "registry-test"
    ) &&
    !pipelineRegistry.has(
      "registry-test"
    ) &&
    pipelineRegistry.get(
      "registry-test"
    ) ===
      null;

  pipelineRegistry.register(
    testDefinition
  );

  pipelineRegistry.clear();

  const clearValid =
    pipelineRegistry.list()
      .length ===
    0;

  const firstBootstrap =
    bootstrapPipelineRegistry();

  const secondBootstrap =
    bootstrapPipelineRegistry();

  const bootstrapValid =
    firstBootstrap ===
      pipelineRegistry &&
    secondBootstrap ===
      pipelineRegistry &&
    isPipelineRegistryBootstrapped() &&
    pipelineRegistry.has(
      "ai-generation"
    ) &&
    pipelineRegistry.list()
      .length ===
      1;

  console.log({
    registerValid,

    getValid,

    hasValid,

    listValid,

    duplicateProtectionValid,

    unregisterValid,

    clearValid,

    bootstrapValid,

    registeredPipelines:
      pipelineRegistry.list().map(
        (definition) => ({
          name:
            definition.name,

          version:
            definition.version,
        })
      ),
  });

  resetPipelineRegistry();

  const results = [
    registerValid,
    getValid,
    hasValid,
    listValid,
    duplicateProtectionValid,
    unregisterValid,
    clearValid,
    bootstrapValid,
  ];

  if (
    !results.every(
      Boolean
    )
  ) {
    throw new Error(
      "Pipeline registry test failed."
    );
  }

  console.log(
    "\nPipeline registry test passed."
  );
}

try {
  runTest();
} catch (error) {
  resetPipelineRegistry();

  console.error(
    "\nPipeline registry test failed:"
  );

  console.error(
    error
  );

  process.exitCode =
    1;
}