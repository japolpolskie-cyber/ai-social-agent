// ======================================================
// Pipeline Logger Subscriber
// ======================================================

const {
  PIPELINE_EVENTS,
} = require("../events/pipelineEvents");

const {
  formatPipelineLog,
} = require("../logging/pipelineLogFormatter");

function validateLogger(logger) {
  if (!logger || typeof logger.log !== "function") {
    throw new TypeError(
      "Pipeline logger subscriber requires a logger."
    );
  }
}

function createPipelineLoggerSubscriber({
  logger,
} = {}) {
  validateLogger(logger);

  async function handle(event) {
    const logEntry = formatPipelineLog(event);

    logger.log(logEntry);
  }

  return {
    name: "pipeline-logger-subscriber",

    events: Object.values(PIPELINE_EVENTS),

    handle,
  };
}

module.exports = {
  createPipelineLoggerSubscriber,
};