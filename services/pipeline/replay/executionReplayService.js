// ======================================================
// Execution Replay Service
// ======================================================

const PipelineError = require(
  "../pipelineError"
);

const executionQueryService = require(
  "../query/executionQueryService"
);

const pipelineExecutionService = require(
  "../execution/pipelineExecutionService"
);

const {
  createExecutionReplayRequest,
} = require(
  "./executionReplayRequest"
);

// ======================================================
// Errors
// ======================================================

function createExecutionNotFoundError(
  executionId
) {
  return new PipelineError({
    code:
      "EXECUTION_NOT_FOUND",

    message:
      `Execution "${executionId}" was not found.`,

    stage:
      "execution-replay",

    statusCode:
      404,

    details: {
      executionId,
    },
  });
}

function createSnapshotUnavailableError(
  executionId
) {
  return new PipelineError({
    code:
      "EXECUTION_SNAPSHOT_UNAVAILABLE",

    message:
      `Execution "${executionId}" does not contain a replayable request snapshot.`,

    stage:
      "execution-replay",

    statusCode:
      409,

    details: {
      executionId,
    },
  });
}

// ======================================================
// Validation
// ======================================================

function normalizeExecutionId(
  executionId
) {
  if (
    typeof executionId !== "string" ||
    executionId.trim().length === 0
  ) {
    throw new PipelineError({
      code:
        "EXECUTION_REPLAY_REQUEST_INVALID",

      message:
        "A valid execution ID is required for replay.",

      stage:
        "execution-replay",

      statusCode:
        400,

      details: {
        field:
          "executionId",
      },
    });
  }

  return executionId.trim();
}

// ======================================================
// Service Factory
// ======================================================

function createExecutionReplayService({
  getExecution =
    executionQueryService.getExecution,

  executePipeline =
    pipelineExecutionService.execute,
} = {}) {
  if (
    typeof getExecution !==
    "function"
  ) {
    throw new TypeError(
      'Execution replay service requires "getExecution()".'
    );
  }

  if (
    typeof executePipeline !==
    "function"
  ) {
    throw new TypeError(
      'Execution replay service requires "executePipeline()".'
    );
  }

  async function replayExecution(
    executionId,
    options = {}
  ) {
    const normalizedExecutionId =
      normalizeExecutionId(
        executionId
      );

    const originalExecution =
      await getExecution(
        normalizedExecutionId
      );

    if (!originalExecution) {
      throw createExecutionNotFoundError(
        normalizedExecutionId
      );
    }

    if (
      !originalExecution
        .requestSnapshot
    ) {
      throw createSnapshotUnavailableError(
        normalizedExecutionId
      );
    }

    const replayRequest =
      createExecutionReplayRequest({
        originalExecutionId:
          normalizedExecutionId,

        requestSnapshot:
          originalExecution
            .requestSnapshot,

        metadata:
          options.metadata ||
          {},
      });

    const result =
      await executePipeline(
        replayRequest.request
      );

    return Object.freeze({
      replayedFrom:
        normalizedExecutionId,

      newExecutionId:
        replayRequest
          .newExecutionId,

      pipeline:
        replayRequest
          .request
          .pipelineName,

      result,
    });
  }

  return Object.freeze({
    replayExecution,
  });
}

// ======================================================
// Default Service
// ======================================================

const defaultReplayService =
  createExecutionReplayService();

module.exports = {
  createExecutionReplayService,

  replayExecution:
    defaultReplayService
      .replayExecution,
};