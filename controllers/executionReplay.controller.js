// ======================================================
// Execution Replay Controller
// ======================================================

const responseService = require(
  "../services/responseService"
);

const executionReplayService =
  require(
    "../services/pipeline/replay/executionReplayService"
  );

// ======================================================
// Replay Execution
// ======================================================

async function replayExecution(
  req,
  res
) {
  try {
    const replay =
      await executionReplayService
        .replayExecution(
          req.params.executionId,
          {
            metadata:
              req.body?.metadata ||
              {},
          }
        );

    return responseService.success(
      res,
      {
        replayedFrom:
          replay.replayedFrom,

        newExecutionId:
          replay.newExecutionId,

        pipeline:
          replay.pipeline,

        execution:
          replay.result,
      },
      201
    );
  } catch (error) {
    return responseService.error(
      res,
      error,
      error.statusCode ||
      500
    );
  }
}

module.exports = {
  replayExecution,
};