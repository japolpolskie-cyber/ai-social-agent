// ======================================================
// Pipeline Runner
// ======================================================

const PipelineError = require(
  "./pipelineError"
);

const {
  createPipelineExecutionEngine,
} = require(
  "./execution-engine/executionEngine"
);

// ======================================================
// Stage Helpers
// ======================================================

function getStageName(
  stage,
  index
) {
  if (
    stage &&
    typeof stage.name === "string" &&
    stage.name.trim()
  ) {
    return stage.name.trim();
  }

  return `stage-${index + 1}`;
}

function validateStages(stages) {
  if (
    !Array.isArray(stages) ||
    stages.length === 0
  ) {
    throw new PipelineError({
      code:
        "PIPELINE_STAGES_INVALID",

      message:
        "Pipeline requires at least one stage.",

      stage:
        "pipeline-runner",

      statusCode: 500,
    });
  }

  stages.forEach(
    (stage, index) => {
      if (
        !stage ||
        typeof stage.execute !==
          "function"
      ) {
        throw new PipelineError({
          code:
            "PIPELINE_STAGE_INVALID",

          message:
            `Pipeline stage at index ${index} must ` +
            "provide an execute function.",

          stage:
            getStageName(
              stage,
              index
            ),

          statusCode: 500,
        });
      }
    }
  );
}

// ======================================================
// Stage Result Validation
// ======================================================

function validateStageResult({
  result,
  context,
  stageName,
}) {
  if (
    result !== undefined &&
    result !== null &&
    result !== context
  ) {
    throw new PipelineError({
      code:
        "PIPELINE_STAGE_RESULT_INVALID",

      message:
        `Pipeline stage "${stageName}" must ` +
        "return the existing pipeline context " +
        "or no value.",

      stage:
        stageName,

      statusCode: 500,
    });
  }
}

// ======================================================
// Pipeline Execution
// ======================================================

async function run({
  name,
  context,
  stages,
}) {
  validateStages(stages);

  const executionEngine =
    createPipelineExecutionEngine({
      context,

      pipelineName:
        name,

      stageCount:
        stages.length,
    });

  await executionEngine
    .initializeExecution();

  try {
    for (
      let index = 0;
      index < stages.length;
      index += 1
    ) {
      const stage =
        stages[index];

      const stageName =
        getStageName(
          stage,
          index
        );

      const stageExecution =
        await executionEngine.startStage({
          stageName,
          stageIndex:
            index,
        });

      try {
        const stageResult =
          await stage.execute(
            context
          );

        validateStageResult({
          result:
            stageResult,

          context,

          stageName,
        });

        await executionEngine
          .completeStage({
            stageName,
            stageIndex:
              index,

            startedAt:
              stageExecution.startedAt,
          });
      } catch (error) {
        const normalizedError =
          await executionEngine
            .failStage({
              error,

              stageName,

              stageIndex:
                index,

              startedAt:
                stageExecution.startedAt,
            });

        throw normalizedError;
      }
    }

    await executionEngine
      .completeExecution();

    return context;
  } catch (error) {
    const pipelineError =
      await executionEngine
        .failExecution(
          error
        );

    throw pipelineError;
  }
}

module.exports = {
  run,
};