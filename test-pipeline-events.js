// ======================================================
// Pipeline Lifecycle Event Test
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
      executionId: "test-execution-001",
    },

    testValue: 0,
  };
}

// ======================================================
// Test Stages
// ======================================================

const firstStage = {
  name: "first-stage",

  async execute(context) {
    context.testValue += 1;
    return context;
  },
};

const secondStage = {
  name: "second-stage",

  async execute(context) {
    context.testValue += 1;
    return context;
  },
};

// ======================================================
// Event Collection
// ======================================================

async function runTest() {
  pipelineEventBus.clear();

  const receivedEvents = [];

  const eventNames = Object.values(
    PIPELINE_EVENTS
  );

  const unsubscribeFunctions = eventNames.map(
    (eventName) =>
      pipelineEventBus.subscribe(
        eventName,
        async (event) => {
          receivedEvents.push(event);
        }
      )
  );

  const context = createTestContext();

  try {
    await pipelineRunner.run({
      name: "pipeline-event-test",
      context,
      stages: [
        firstStage,
        secondStage,
      ],
    });

    const eventSequence = receivedEvents.map(
      (event) => event.name
    );

    const expectedSequence = [
      PIPELINE_EVENTS.PIPELINE_STARTED,

      PIPELINE_EVENTS.STAGE_STARTED,
      PIPELINE_EVENTS.STAGE_COMPLETED,

      PIPELINE_EVENTS.STAGE_STARTED,
      PIPELINE_EVENTS.STAGE_COMPLETED,

      PIPELINE_EVENTS.PIPELINE_COMPLETED,
    ];

    const sequenceValid =
      JSON.stringify(eventSequence) ===
      JSON.stringify(expectedSequence);

    const executionValid =
      context.testValue === 2 &&
      context.execution.completedStages.length === 2 &&
      context.execution.stageMetrics.length === 2;

    console.log({
      sequenceValid,
      executionValid,

      listenerCounts: Object.fromEntries(
        eventNames.map((eventName) => [
          eventName,
          pipelineEventBus.listenerCount(
            eventName
          ),
        ])
      ),

      eventSequence,

      events: receivedEvents,
    });

    if (!sequenceValid) {
      throw new Error(
        "Pipeline event sequence is invalid."
      );
    }

    if (!executionValid) {
      throw new Error(
        "Pipeline execution result is invalid."
      );
    }

    console.log(
      "\nPipeline lifecycle event test passed."
    );
  } finally {
    unsubscribeFunctions.forEach(
      (unsubscribe) => unsubscribe()
    );

    pipelineEventBus.clear();
  }
}

runTest().catch((error) => {
  console.error(
    "\nPipeline lifecycle event test failed:"
  );

  console.error(error);

  process.exitCode = 1;
});