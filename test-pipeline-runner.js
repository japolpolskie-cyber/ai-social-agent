// ======================================================
// Pipeline Runner Test
// ======================================================

const pipelineRunner = require("./services/pipeline/pipelineRunner");
const PipelineError = require("./services/pipeline/pipelineError");

// ======================================================
// Success Stages
// ======================================================

const firstStage = {
  name: "first-stage",

  async execute(context) {
    context.firstValue = "completed";
    return context;
  },
};

const secondStage = {
  name: "second-stage",

  async execute(context) {
    context.secondValue = "completed";
    return context;
  },
};

// ======================================================
// Failure Stages
// ======================================================

const successfulStage = {
  name: "successful-stage",

  async execute(context) {
    context.successfulStageCompleted = true;
    return context;
  },
};

const failingStage = {
  name: "failing-stage",

  async execute() {
    throw new Error("Simulated stage failure.");
  },
};

const skippedStage = {
  name: "skipped-stage",

  async execute(context) {
    context.skippedStageExecuted = true;
    return context;
  },
};

// ======================================================
// Success Test
// ======================================================

async function runSuccessTest() {
  const context = {
    input: {
      topic: "Pipeline runner success test",
    },
  };

  const result = await pipelineRunner.run({
    name: "pipeline-success-test",
    context,
    stages: [firstStage, secondStage],
  });

  console.log("=== SUCCESS TEST ===");

  console.log("\nPipeline Data:");
  console.log({
    firstValue: result.firstValue,
    secondValue: result.secondValue,
  });

  console.log("\nExecution:");
  console.log(result.execution);
}

// ======================================================
// Failure Test
// ======================================================

async function runFailureTest() {
  const context = {
    input: {
      topic: "Pipeline runner failure test",
    },
  };

  try {
    await pipelineRunner.run({
      name: "pipeline-failure-test",
      context,
      stages: [successfulStage, failingStage, skippedStage],
    });
  } catch (error) {
    console.log("\n=== FAILURE TEST ===");

    console.log("\nError:");
    console.log(error.toJSON());

    console.log("\nError Metadata:");
    console.log({
      name: error.name,
      statusCode: error.statusCode,
      isPipelineError: PipelineError.isPipelineError(error),
      hasCause: Boolean(error.cause),
    });

    console.log("\nExecution:");
    console.log(context.execution);

    console.log("\nPipeline State:");
    console.log({
      successfulStageCompleted: context.successfulStageCompleted,
      skippedStageExecuted: context.skippedStageExecuted || false,
    });
  }
}

// ======================================================
// Run Tests
// ======================================================

async function runTests() {
  await runSuccessTest();
  await runFailureTest();
}

runTests().catch((error) => {
  console.error("Pipeline Runner Test Failed:");
  console.error(error);
  process.exitCode = 1;
});