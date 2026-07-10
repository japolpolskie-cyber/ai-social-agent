// ======================================================
// AI Output Processor
// ======================================================

const repairConfig = require("../config/repair.config");
const validatorService = require("./validatorService");
const formatterService = require("./formatterService");
const logger = require("./logger");
const { repairOutput } = require("./repairEngine");
const { createRepairResult } = require("./repairResult");

async function processOutput({
  output,
  rules = {},
  context = {},
  provider,
  model,
  workflow = "AI Output Processing",
  endpoint = "",
  options = {},
}) {
  if (typeof output !== "string") {
    throw new Error(
      "Output processor requires a string output."
    );
  }

  const originalOutput =
    formatterService.clean(output);

  const initialValidation =
    validatorService.validate(
      originalOutput,
      rules
    );

  if (initialValidation.valid) {
    return createRepairResult({
      output: originalOutput,
      validation: initialValidation,
      attempted: false,
      repaired: false,
      attempts: 0,
      originalOutput: null,
      originalValidation: initialValidation,
      remainingIssues: [],
      duration: 0,
      promptVersion: repairConfig.promptVersion,
    });
  }

  const repairStart = Date.now();

  const repairResult = await repairOutput({
    output: originalOutput,
    validation: initialValidation,
    rules,
    context,
    provider,
    model,
    workflow: `${workflow} Repair`,
    endpoint,
    options,
  });

  const repairDuration =
    Date.now() - repairStart;

  if (!repairResult.attempted) {
    const result = createRepairResult({
      output: originalOutput,
      validation: initialValidation,
      attempted: false,
      repaired: false,
      attempts: 0,
      originalOutput: null,
      originalValidation: initialValidation,
      remainingIssues:
        initialValidation.issues,
      duration: repairDuration,
      promptVersion: repairConfig.promptVersion,
    });

    logger.logRepair({
      workflow,
      endpoint,
      provider,
      model,
      originalOutput,
      finalOutput: result.output,
      originalValidation: initialValidation,
      finalValidation: result.validation,
      repair: result.repair,
    });

    return result;
  }

  const cleanedRepairedOutput =
    formatterService.clean(
      repairResult.output
    );

  const repairedValidation =
    validatorService.validate(
      cleanedRepairedOutput,
      rules
    );

  const repairSucceeded =
    repairedValidation.valid;

  const shouldUseRepairedOutput =
    repairSucceeded ||
    repairConfig.returnBestAvailableOutput;

  const finalOutput = shouldUseRepairedOutput
    ? cleanedRepairedOutput
    : originalOutput;

  const finalValidation =
    shouldUseRepairedOutput
      ? repairedValidation
      : initialValidation;

  const result = createRepairResult({
    output: finalOutput,
    validation: finalValidation,
    attempted: true,
    repaired: repairSucceeded,
    attempts: repairResult.attempts,
    originalOutput,
    originalValidation: initialValidation,
    remainingIssues:
      finalValidation.issues,
    duration: repairDuration,
    promptVersion: repairConfig.promptVersion,
  });

  logger.logRepair({
    workflow,
    endpoint,
    provider,
    model,
    originalOutput,
    finalOutput: result.output,
    originalValidation: initialValidation,
    finalValidation: result.validation,
    repair: result.repair,
  });

  return result;
}

module.exports = {
  processOutput,
};