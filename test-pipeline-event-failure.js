// ======================================================
// Pipeline Lifecycle Failure Event Test
// ======================================================

const pipelineRunner = require(
  "./services/pipeline/pipelineRunner"
);

const {
  PIPELINE_EVENTS,
} = require(
  "./services/pipeline/events/pipelineEvents"
);

const pipelineEventBus = require(
  "./services/pipeline/events/pipelineEventBus"
);

// ======================================================
// Test Context
// ======================================================

function createTestContext() {
  return {
    execution: {
      pipeline: null,
      currentStage: null,
      completedStages: [],
      stageMetrics: [],
      startedAt: null,
      completedAt: null,
      duration: 0,
    },

    metadata: {
      executionId: "failure-test-001",
    },
  };
}

// ======================================================
// Test Stages
// ======================================================

const successStage = {
  name: "success-stage",

  async execute(context) {
    return context;
  },
};

const failureStage = {
  name: "failure-stage",

  async execute() {
    throw new Error("Intentional stage failure.");
  },
};

const skippedStage = {
  name: "skipped-stage",

  async execute(context) {
    return context;
  },
};

// ======================================================
// Test
// ======================================================

async function runTest() {
  pipelineEventBus.clear();

  const receivedEvents = [];

  const unsubscribeFunctions = Object.values(
    PIPELINE_EVENTS
  ).map((eventName) =>
    pipelineEventBus.subscribe(
      eventName,
      async (event) => {
        receivedEvents.push(event);
      }
    )
  );

  const context = createTestContext();

  let capturedError = null;

  try {
    await pipelineRunner.run({
      name: "pipeline-failure-test",
      context,
      stages: [
        successStage,
        failureStage,
        skippedStage,
      ],
    });
  } catch (error) {
    capturedError = error;
  } finally {
    unsubscribeFunctions.forEach(
      (unsubscribe) => unsubscribe()
    );
  }

  const eventSequence = receivedEvents.map(
    (event) => event.name
  );

  const expectedSequence = [
    PIPELINE_EVENTS.PIPELINE_STARTED,

    PIPELINE_EVENTS.STAGE_STARTED,
    PIPELINE_EVENTS.STAGE_COMPLETED,

    PIPELINE_EVENTS.STAGE_STARTED,
    PIPELINE_EVENTS.STAGE_FAILED,

    PIPELINE_EVENTS.PIPELINE_FAILED,
  ];

  const sequenceValid =
    JSON.stringify(eventSequence) ===
    JSON.stringify(expectedSequence);

  const failedStageEvent = receivedEvents.find(
    (event) =>
      event.name ===
      PIPELINE_EVENTS.STAGE_FAILED
  );

  const pipelineFailedEvent = receivedEvents.find(
    (event) =>
      event.name ===
      PIPELINE_EVENTS.PIPELINE_FAILED
  );

  const errorValid =
    capturedError?.code ===
      "PIPELINE_STAGE_FAILED" &&
    capturedError?.stage ===
      "failure-stage";

  const executionValid =
    context.execution.completedStages.length === 1 &&
    context.execution.completedStages[0] ===
      "success-stage" &&
    context.execution.stageMetrics.length === 2 &&
    context.execution.stageMetrics[1].status ===
      "failed" &&
    context.execution.currentStage === null &&
    context.execution.completedAt !== null;

  const eventErrorValid =
    failedStageEvent?.error?.code ===
      "PIPELINE_STAGE_FAILED" &&
    failedStageEvent?.error?.stage ===
      "failure-stage" &&
    pipelineFailedEvent?.error?.code ===
      "PIPELINE_STAGE_FAILED";

  console.log({
    sequenceValid,
    errorValid,
    executionValid,
    eventErrorValid,
    eventSequence,
    capturedError: capturedError?.toJSON?.(),
    execution: context.execution,
  });

  pipelineEventBus.clear();

  if (!sequenceValid) {
    throw new Error(
      "Failure event sequence is invalid."
    );
  }

  if (!errorValid) {
    throw new Error(
      "Pipeline error normalization is invalid."
    );
  }

  if (!executionValid) {
    throw new Error(
      "Failure execution state is invalid."
    );
  }

  if (!eventErrorValid) {
    throw new Error(
      "Failure event payload is invalid."
    );
  }

  console.log(
    "\nPipeline lifecycle failure test passed."
  );
}

runTest().catch((error) => {
  console.error(
    "\nPipeline lifecycle failure test failed:"
  );

  console.error(error);

  process.exitCode = 1;
});