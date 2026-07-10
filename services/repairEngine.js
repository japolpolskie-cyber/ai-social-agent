// ======================================================
// AI Output Repair Engine
// ======================================================

const repairConfig = require("../config/repair.config");
const { runAI } = require("./aiRunner");
const { buildRepairPrompt } = require("./repairPromptBuilder");

function getRepairableIssues(issues = []) {
  if (!Array.isArray(issues)) {
    return [];
  }

  return issues.filter((issue) => {
    return repairConfig.repairableIssues.includes(issue.type);
  });
}

async function repairOutput({
  output,
  validation,
  rules = {},
  context = {},
  provider,
  model,
  workflow = "AI Output Repair",
  endpoint = "",
  options = {},
}) {
  if (typeof output !== "string" || output.trim().length === 0) {
    throw new Error("Repair engine requires a non-empty output.");
  }

  if (!validation || typeof validation !== "object") {
    throw new Error("Repair engine requires a validation result.");
  }

  if (validation.valid === true) {
    return {
      output,
      attempted: false,
      attempts: 0,
      repairableIssues: [],
    };
  }

  if (!repairConfig.enabled) {
    return {
      output,
      attempted: false,
      attempts: 0,
      repairableIssues: [],
    };
  }

  const repairableIssues = getRepairableIssues(validation.issues);

  if (repairableIssues.length === 0) {
    return {
      output,
      attempted: false,
      attempts: 0,
      repairableIssues: [],
    };
  }

  const repairPrompt = buildRepairPrompt({
    output,
    issues: repairableIssues,
    rules,
    context,
  });

  const repairProvider = repairConfig.preserveOriginalProvider
    ? provider
    : undefined;

  const repairModel = repairConfig.preserveOriginalModel
    ? model
    : undefined;

  const repairedOutput = await runAI({
    provider: repairProvider,
    model: repairModel,
    workflow,
    endpoint,
    prompt: repairPrompt,
    options,
  });

  return {
    output: repairedOutput,
    attempted: true,
    attempts: 1,
    repairableIssues,
  };
}

module.exports = {
  repairOutput,
};