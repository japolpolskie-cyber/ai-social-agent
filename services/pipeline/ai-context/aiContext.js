// ======================================================
// AI Pipeline Context
// ======================================================

const {
  createAIContext,
} = require(
  "./createAIContext"
);

// ======================================================
// State Factory
// ======================================================

function createInitialState() {
  return {
    contentContext:
      null,

    route:
      null,

    prompt:
      null,

    execution:
      null,

    processed:
      null,
  };
}

// ======================================================
// Snapshot
// ======================================================

function createSnapshot(state) {
  return {
    contentContext:
      state.contentContext,

    route:
      state.route,

    prompt:
      state.prompt,

    execution:
      state.execution,

    processed:
      state.processed,
  };
}

// ======================================================
// Factory
// ======================================================

function createPipelineAIContext() {
  const state =
    createInitialState();

  const api =
    createAIContext({
      setContentContext(value) {
        state.contentContext =
          value;

        return value;
      },

      setRoute(value) {
        state.route =
          value;

        return value;
      },

      setPrompt(value) {
        state.prompt =
          value;

        return value;
      },

      setExecution(value) {
        state.execution =
          value;

        return value;
      },

      setProcessed(value) {
        state.processed =
          value;

        return value;
      },

      snapshot() {
        return createSnapshot(
          state
        );
      },
    });

  return api;
}

module.exports = {
  createPipelineAIContext,
};