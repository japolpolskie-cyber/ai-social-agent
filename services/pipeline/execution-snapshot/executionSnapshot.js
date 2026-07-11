// ======================================================
// Pipeline Execution Snapshot
// ======================================================

const {
  createExecutionSnapshot,
} = require(
  "./createExecutionSnapshot"
);

// ======================================================
// Factory
// ======================================================

function createPipelineExecutionSnapshot(
  request
) {
  if (
    !request ||
    typeof request !== "object" ||
    Array.isArray(request)
  ) {
    throw new TypeError(
      "Pipeline execution snapshot requires a valid request."
    );
  }

  return createExecutionSnapshot({
    pipelineName:
      request.pipelineName,

    input:
      request.input ||
      {},

    endpoint:
      request.endpoint ||
      null,

    options: {
      metadata: {
        ...(
          request.configuration
            ?.metadata ||
          {}
        ),
      },
    },
  });
}

module.exports = {
  createPipelineExecutionSnapshot,
};