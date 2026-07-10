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

function expectError(label, action) {
  try {
    action();

    return {
      label,
      passed: false,
      message: "Expected an error but none was thrown.",
    };
  } catch (error) {
    return {
      label,
      passed: error instanceof TypeError,
      message: error.message,
    };
  }
}

// ======================================================
// Valid Stage
// ======================================================

const validStage = {
  name: "valid-stage",

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
      name: "builder-test",
      version: "1.0.0",
      description: "Builder validation test.",
      metadata: {
        category: "test",
      },
      stages: [validStage],
    });

  const validationResults = [
    expectError("missing-name", () =>
      createPipelineDefinition({
        version: "1.0.0",
        stages: [validStage],
      })
    ),

    expectError("missing-version", () =>
      createPipelineDefinition({
        name: "invalid-pipeline",
        stages: [validStage],
      })
    ),

    expectError("empty-stages", () =>
      createPipelineDefinition({
        name: "invalid-pipeline",
        version: "1.0.0",
        stages: [],
      })
    ),

    expectError("invalid-stage", () =>
      createPipelineDefinition({
        name: "invalid-pipeline",
        version: "1.0.0",
        stages: [
          {
            name: "broken-stage",
          },
        ],
      })
    ),
  ];

  const validDefinitionPassed =
    validDefinition.name === "builder-test" &&
    validDefinition.version === "1.0.0" &&
    validDefinition.stages.length === 1;

  const validationPassed =
    validationResults.every(
      (result) => result.passed
    );

  const immutabilityPassed =
    Object.isFrozen(validDefinition) &&
    Object.isFrozen(validDefinition.stages) &&
    Object.isFrozen(validDefinition.metadata);

  console.log({
    validDefinitionPassed,
    validationPassed,
    immutabilityPassed,
    validationResults,
    definition: validDefinition,
  });

  if (!validDefinitionPassed) {
    throw new Error(
      "Valid pipeline definition creation failed."
    );
  }

  if (!validationPassed) {
    throw new Error(
      "Pipeline definition validation failed."
    );
  }

  if (!immutabilityPassed) {
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

  console.error(error);

  process.exitCode = 1;
}