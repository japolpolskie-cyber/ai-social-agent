// ======================================================
// Execution Controller
// ======================================================

const responseService = require(
  "../services/responseService"
);

const executionQueryService = require(
  "../services/pipeline/query/executionQueryService"
);

// ======================================================
// Get Execution History
// ======================================================

async function getExecutions(
  req,
  res
) {
  try {
    const history =
      await executionQueryService.getExecutionHistory();

    return responseService.success(
      res,
      history
    );
  } catch (error) {
    return responseService.error(
      res,
      error
    );
  }
}

// ======================================================
// Get Execution
// ======================================================

async function getExecution(
  req,
  res
) {
  try {
    const execution =
      await executionQueryService.getExecution(
        req.params.executionId
      );

    if (!execution) {
      return responseService.error(
        res,
        {
          code:
            "EXECUTION_NOT_FOUND",

          message:
            "Execution record was not found.",
        },
        404
      );
    }

    return responseService.success(
      res,
      {
        execution,
      }
    );
  } catch (error) {
    return responseService.error(
      res,
      error
    );
  }
}

module.exports = {
  getExecutions,
  getExecution,
};