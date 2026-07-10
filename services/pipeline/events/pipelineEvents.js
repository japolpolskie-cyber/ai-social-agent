// ======================================================
// Pipeline Events
// ======================================================

const PIPELINE_EVENTS = Object.freeze({
  PIPELINE_STARTED: "pipeline.started",
  PIPELINE_COMPLETED: "pipeline.completed",
  PIPELINE_FAILED: "pipeline.failed",

  STAGE_STARTED: "pipeline.stage.started",
  STAGE_COMPLETED: "pipeline.stage.completed",
  STAGE_FAILED: "pipeline.stage.failed",
});

function isValidPipelineEvent(eventName) {
  return Object.values(PIPELINE_EVENTS).includes(eventName);
}

module.exports = {
  PIPELINE_EVENTS,
  isValidPipelineEvent,
};