// ======================================================
// Pipeline Event
// ======================================================

const {
  isValidPipelineEvent,
} = require("./pipelineEvents");

function normalizeError(error) {
  if (!error) {
    return null;
  }

  if (typeof error.toJSON === "function") {
    return error.toJSON();
  }

  return {
    code: error.code || "PIPELINE_EVENT_ERROR",
    message: error.message || "An unknown pipeline error occurred.",
    stage: error.stage || null,
  };
}

function createPipelineEvent({
  name,
  pipeline,
  executionId = null,
  stage = null,
  status = null,
  timestamp = new Date().toISOString(),
  duration = null,
  metadata = null,
  error = null,
} = {}) {
  if (!isValidPipelineEvent(name)) {
    throw new TypeError(
      `Unsupported pipeline event: ${name || "undefined"}.`
    );
  }

  if (
    typeof pipeline !== "string" ||
    !pipeline.trim()
  ) {
    throw new TypeError(
      "Pipeline event requires a valid pipeline name."
    );
  }

  return Object.freeze({
    name,
    pipeline: pipeline.trim(),
    executionId,
    stage,
    status,
    timestamp,
    duration,
    metadata,
    error: normalizeError(error),
  });
}

module.exports = {
  createPipelineEvent,
};