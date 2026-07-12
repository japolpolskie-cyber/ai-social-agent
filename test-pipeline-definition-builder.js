// ======================================================
// Pipeline Definition Builder Test
// ======================================================

const {
  createPipelineDefinition,
} = require(
  "./services/pipeline/definitions/createPipelineDefinition"
);

// ======================================================
// Test Helpers
// ======================================================

function expectError(
  label,
  action,
  expectedMessage
) {
  try {
    action();

    return {
      label,
      passed:
        false,

      message:
        "Expected an error but none was thrown.",
    };
  } catch (error) {
    return {
      label,

      passed:
        error instanceof TypeError &&
        (
          !expectedMessage ||
          error.message.includes(
            expectedMessage
          )
        ),

      message:
        error.message,
    };
  }
}

// ======================================================
// Valid Runtime
// ======================================================

const validRuntime = {
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
// Valid Stage
// ======================================================

const validStage = {
  name:
    "valid-stage",

  execute(context) {
    return context;
  },
};

// ======================================================
// Test
// ======================================================

function runTest() {
  const validDefinition =
    createPipelineDefinition({
      name:
        "builder-test",

      version:
        "1.0.0",

      description:
        "Builder validation test.",

      metadata: {
        category:
          "test",
      },

      runtime:
        validRuntime,

      stages: [
        validStage,
      ],
    });

  const validationResults = [
    expectError(
      "missing-name",

      () =>
        createPipelineDefinition({
          version:
            "1.0.0",

          runtime:
            validRuntime,

          stages: [
            validStage,
          ],
        }),

      '"name"'
    ),

    expectError(
      "missing-version",

      () =>
        createPipelineDefinition({
          name:
            "invalid-pipeline",

          runtime:
            validRuntime,

          stages: [
            validStage,
          ],
        }),

      '"version"'
    ),

    expectError(
      "missing-runtime",

      () =>
        createPipelineDefinition({
          name:
            "invalid-pipeline",

          version:
            "1.0.0",

          stages: [
            validStage,
          ],
        }),

      "requires a runtime"
    ),

    expectError(
      "invalid-runtime",

      () =>
        createPipelineDefinition({
          name:
            "invalid-pipeline",

          version:
            "1.0.0",

          runtime: {
            createContext() {},
          },

          stages: [
            validStage,
          ],
        }),

      'must provide "initialize"()'
    ),

    expectError(
      "empty-stages",

      () =>
        createPipelineDefinition({
          name:
            "invalid-pipeline",

          version:
            "1.0.0",

          runtime:
            validRuntime,

          stages:
            [],
        }),

      "at least one stage"
    ),

    expectError(
      "invalid-stage",

      () =>
        createPipelineDefinition({
          name:
            "invalid-pipeline",

          version:
            "1.0.0",

          runtime:
            validRuntime,

          stages: [
            {
              name:
                "broken-stage",
            },
          ],
        }),

      "Invalid stage"
    ),
  ];

  const validDefinitionPassed =
    validDefinition.name ===
      "builder-test" &&
    validDefinition.version ===
      "1.0.0" &&
    validDefinition.runtime ===
      validRuntime &&
    validDefinition.stages.length ===
      1;

  const validationPassed =
    validationResults.every(
      (result) =>
        result.passed
    );

  const immutabilityPassed =
    Object.isFrozen(
      validDefinition
    ) &&
    Object.isFrozen(
      validDefinition.stages
    ) &&
    Object.isFrozen(
      validDefinition.metadata
    );

  console.log({
    validDefinitionPassed,

    validationPassed,

    immutabilityPassed,

    validationResults,

    definition:
      validDefinition,
  });

  if (
    !validDefinitionPassed
  ) {
    throw new Error(
      "Valid pipeline definition creation failed."
    );
  }

  if (
    !validationPassed
  ) {
    throw new Error(
      "Pipeline definition validation failed."
    );
  }

  if (
    !immutabilityPassed
  ) {
    throw new Error(
      "Pipeline definition immutability failed."
    );
  }

  console.log(
    "\nPipeline definition builder test passed."
  );
}

try {
  runTest();
} catch (error) {
  console.error(
    "\nPipeline definition builder test failed:"
  );

  console.error(
    error
  );

  process.exitCode =
    1;
}