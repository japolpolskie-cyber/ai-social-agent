// ======================================================
// Pipeline Log Formatter
// ======================================================

const {
  PIPELINE_EVENTS,
} = require("../events/pipelineEvents");

function getLogLevel(eventName) {
  switch (eventName) {
    case PIPELINE_EVENTS.PIPELINE_FAILED:
    case PIPELINE_EVENTS.STAGE_FAILED:
      return "error";

    case PIPELINE_EVENTS.PIPELINE_STARTED:
    case PIPELINE_EVENTS.PIPELINE_COMPLETED:
      return "info";

    case PIPELINE_EVENTS.STAGE_STARTED:
    case PIPELINE_EVENTS.STAGE_COMPLETED:
      return "debug";

    default:
      return "info";
  }
}

function getMessage(event) {
  switch (event.name) {
    case PIPELINE_EVENTS.PIPELINE_STARTED:
      return `Pipeline "${event.pipeline}" started.`;

    case PIPELINE_EVENTS.PIPELINE_COMPLETED:
      return `Pipeline "${event.pipeline}" completed.`;

    case PIPELINE_EVENTS.PIPELINE_FAILED:
      return `Pipeline "${event.pipeline}" failed.`;

    case PIPELINE_EVENTS.STAGE_STARTED:
      return (
        `Pipeline stage "${event.stage}" started.`
      );

    case PIPELINE_EVENTS.STAGE_COMPLETED:
      return (
        `Pipeline stage "${event.stage}" completed.`
      );

    case PIPELINE_EVENTS.STAGE_FAILED:
      return (
        `Pipeline stage "${event.stage}" failed.`
      );

    default:
      return "Pipeline lifecycle event received.";
  }
}

function formatPipelineLog(event) {
  if (!event || typeof event !== "object") {
    throw new TypeError(
      "Pipeline log formatter requires an event object."
    );
  }

  return {
    level: getLogLevel(event.name),
    message: getMessage(event),

    event: event.name,
    pipeline: event.pipeline,
    executionId: event.executionId,
    stage: event.stage,
    status: event.status,
    eventTimestamp: event.timestamp,
    duration: event.duration,
    metadata: event.metadata,
    error: event.error,
  };
}

module.exports = {
  formatPipelineLog,
};