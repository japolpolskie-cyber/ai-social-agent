// ======================================================
// Pipeline Execution Configuration Test
// ======================================================

const {
  createPipelineExecutionConfig,
} = require(
  "./services/pipeline/execution/pipelineExecutionConfig"
);

// ======================================================
// Explicit Execution ID
// ======================================================

function testExplicitExecutionId() {
  const configuration =
    createPipelineExecutionConfig({
      executionId:
        "execution-config-test-001",

      metadata: {
        source:
          "unit-test",

        client:
          "local-development",
      },
    });

  console.log(
    "\nExplicit configuration:"
  );

  console.log(
    JSON.stringify(
      configuration,
      null,
      2
    )
  );

  if (
    configuration.executionId !==
    "execution-config-test-001"
  ) {
    throw new Error(
      "Explicit execution ID was not preserved."
    );
  }
}

// ======================================================
// Generated Execution ID
// ======================================================

function testGeneratedExecutionId() {
  const configuration =
    createPipelineExecutionConfig();

  console.log(
    "\nGenerated configuration:"
  );

  console.log(
    JSON.stringify(
      configuration,
      null,
      2
    )
  );

  if (
    typeof configuration.executionId !==
      "string" ||
    configuration.executionId.length === 0
  ) {
    throw new Error(
      "Execution ID was not generated."
    );
  }
}

// ======================================================
// Test Runner
// ======================================================

function run() {
  testExplicitExecutionId();
  testGeneratedExecutionId();

  console.log(
    "\n✅ Pipeline execution configuration passed."
  );
}

try {
  run();
} catch (error) {
  console.error(
    "\n❌ Pipeline execution configuration failed."
  );

  console.error(error);

  process.exitCode = 1;
}