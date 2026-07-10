// ======================================================
// AI Runner
// ======================================================

const logger = require("./logger");
const { executeWithFallback } = require("./fallbackEngine");
const { normalizeAIError } = require("./aiError");

async function runAI({
  provider,
  workflow = "AI Workflow",
  endpoint = "",
  prompt = "",
  model,
  options = {},
}) {
  const start = Date.now();

  let providerName = provider || "default";
  let modelName = model || "default";

  try {
    const result = await executeWithFallback({
      provider,
      model,
      prompt,
      options,
    });

    providerName = result.provider;
    modelName = result.model;

    const executionTime = Date.now() - start;

    logger.logRun({
      workflow,
      endpoint,
      provider: providerName,
      prompt,
      response: result.output,
      model: modelName,
      status: "success",
      executionTime,
    });

    return result.output;
  } catch (error) {
    const executionTime = Date.now() - start;
    const friendlyError = normalizeAIError(error.cause || error);

    const attempts = Array.isArray(error.attempts)
      ? error.attempts
      : [];

    const lastAttempt = attempts.at(-1);

    if (lastAttempt) {
      providerName = lastAttempt.provider || providerName;
      modelName = lastAttempt.model || modelName;
    }

    logger.logRun({
      workflow,
      endpoint,
      provider: providerName,
      prompt,
      response: friendlyError,
      model: modelName,
      status: "failed",
      executionTime,
    });

    const executionError = new Error(friendlyError);

    executionError.cause = error;
    executionError.attempts = attempts;

    throw executionError;
  }
}

module.exports = {
  runAI,
};