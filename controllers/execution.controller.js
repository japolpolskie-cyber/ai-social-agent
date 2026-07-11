// ======================================================
// Execution Controller
// ======================================================

const responseService = require(
  "../services/responseService"
);

const executionQueryService = require(
  "../services/pipeline/query/executionQueryService"
);

const {
  createExecutionResource,
} = require(
  "../services/pipeline/resources/executionResource"
);

const {
  createExecutionCollectionResource,
} = require(
  "../services/pipeline/resources/executionCollectionResource"
);

// ======================================================
// Query Helpers
// ======================================================

function parseInteger(
  value
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return undefined;
  }

  const parsed =
    Number(value);

  return Number.isInteger(parsed)
    ? parsed
    : undefined;
}

function createQueryOptions(
  query = {}
) {
  return {
    pipeline:
      query.pipeline,

    status:
      query.status,

    limit:
      parseInteger(
        query.limit
      ),

    offset:
      parseInteger(
        query.offset
      ),
  };
}

// ======================================================
// Get Execution History
// ======================================================

async function getExecutions(
  req,
  res
) {
  try {
    const queryOptions =
      createQueryOptions(
        req.query
      );

    const history =
      await executionQueryService
        .getExecutionHistory(
          queryOptions
        );

    const resource =
      createExecutionCollectionResource({
        total:
          history.total,

        executions:
          history.executions,

        query:
          queryOptions,
      });

    return responseService.success(
      res,
      resource
    );
  } catch (error) {
    return responseService.error(
      res,
      error,
      error.statusCode || 500
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
        execution:
          createExecutionResource(
            execution
          ),
      }
    );
  } catch (error) {
    return responseService.error(
      res,
      error,
      error.statusCode || 500
    );
  }
}

module.exports = {
  getExecutions,
  getExecution,
};