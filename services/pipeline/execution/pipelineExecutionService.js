// ======================================================
// Pipeline Execution Service
// ======================================================

const pipelineExecutor = require(
  "../pipelineExecutor"
);

// ======================================================
// Validation
// ======================================================

function validateRequest(request) {
  if (
    !request ||
    typeof request !== "object" ||
    Array.isArray(request)
  ) {
    throw new TypeError(
      "Pipeline execution request is required."
    );
  }

  if (
    typeof request.pipelineName !==
      "string" ||
    request.pipelineName.trim().length ===
      0
  ) {
    throw new TypeError(
      "Pipeline name is required."
    );
  }

  if (
    !request.input ||
    typeof request.input !==
      "object" ||
    Array.isArray(request.input)
  ) {
    throw new TypeError(
      "Pipeline input is required."
    );
  }

  return request;
}

// ======================================================
// Execute
// ======================================================

async function execute(request) {
  const validatedRequest =
    validateRequest(
      request
    );

  const configuration =
    validatedRequest.configuration ||
    {};

  return pipelineExecutor.execute({
    pipelineName:
      validatedRequest.pipelineName,

    input:
      validatedRequest.input,

    endpoint:
      validatedRequest.endpoint ||
      null,

    options: {
      executionId:
        configuration.executionId ||
        null,

      metadata:
        configuration.metadata ||
        {},
    },
  });
}

async function executePipeline(request) {
  return execute(
    request
  );
}

async function executeRequest(request) {
  return execute(
    request
  );
}

module.exports = Object.freeze({
  execute,
  executePipeline,
  executeRequest,
});