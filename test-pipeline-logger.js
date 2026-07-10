// ======================================================
// Pipeline Logger Subscriber Test
// ======================================================

const pipelineRunner = require(
  "./services/pipeline/pipelineRunner"
);

const pipelineEventBus = require(
  "./services/pipeline/events/pipelineEventBus"
);

const {
  registerPipelineSubscribers,
  arePipelineSubscribersRegistered,
} = require(
  "./services/pipeline/registerPipelineSubscribers"
);

// ======================================================
// Test Logger
// ======================================================

function createTestLogger() {
  const entries = [];

  return {
    entries,

    log(entry) {
      entries.push(entry);
    },
  };
}

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
      executionId: "logger-test-001",
    },
  };
}

// ======================================================
// Test Stage
// ======================================================

const testStage = {
  name: "logger-test-stage",

  async execute(context) {
    return context;
  },
};

// ======================================================
// Test
// ======================================================

async function runTest() {
  pipelineEventBus.clear();

  const testLogger = createTestLogger();

  const registration =
    registerPipelineSubscribers({
      logger: testLogger,
    });

  const duplicateRegistration =
    registerPipelineSubscribers({
      logger: testLogger,
    });

  await pipelineRunner.run({
    name: "pipeline-logger-test",
    context: createTestContext(),
    stages: [testStage],
  });

  const eventNames = testLogger.entries.map(
    (entry) => entry.event
  );

  const expectedEvents = [
    "pipeline.started",
    "pipeline.stage.started",
    "pipeline.stage.completed",
    "pipeline.completed",
  ];

  const logsValid =
    JSON.stringify(eventNames) ===
    JSON.stringify(expectedEvents);

  const registrationValid =
    registration === duplicateRegistration &&
    arePipelineSubscribersRegistered();

  const structureValid =
    testLogger.entries.every(
      (entry) =>
        typeof entry.level === "string" &&
        typeof entry.message === "string" &&
        entry.pipeline ===
          "pipeline-logger-test" &&
        entry.executionId ===
          "logger-test-001"
    );

  registration.unsubscribe();

  const cleanupValid =
    !arePipelineSubscribersRegistered() &&
    Object.values(
      require(
        "./services/pipeline/events/pipelineEvents"
      ).PIPELINE_EVENTS
    ).every(
      (eventName) =>
        pipelineEventBus.listenerCount(
          eventName
        ) === 0
    );

  console.log({
    logsValid,
    registrationValid,
    structureValid,
    cleanupValid,
    eventNames,
    logs: testLogger.entries,
  });

  pipelineEventBus.clear();

  if (!logsValid) {
    throw new Error(
      "Pipeline lifecycle logs are invalid."
    );
  }

  if (!registrationValid) {
    throw new Error(
      "Subscriber registration is not idempotent."
    );
  }

  if (!structureValid) {
    throw new Error(
      "Pipeline log structure is invalid."
    );
  }

  if (!cleanupValid) {
    throw new Error(
      "Pipeline subscriber cleanup failed."
    );
  }

  console.log(
    "\nPipeline logger subscriber test passed."
  );
}

runTest().catch((error) => {
  console.error(
    "\nPipeline logger subscriber test failed:"
  );

  console.error(error);

  process.exitCode = 1;
});