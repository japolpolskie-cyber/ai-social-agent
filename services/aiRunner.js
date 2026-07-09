// ======================================================
// AI Runner
// ======================================================

const logger = require("./logger");
const providerManager = require("./providerManager");
const modelManager = require("./modelManager");

function normalizeAIError(error) {
  const message = error?.message || "AI generation failed.";

  if (
    message.includes("429") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.toLowerCase().includes("quota")
  ) {
    return "AI quota exceeded. Please try again later or switch provider.";
  }

  if (
    message.includes("API key") ||
    message.includes("authentication") ||
    message.includes("401") ||
    message.includes("403")
  ) {
    return "AI provider authentication failed. Please check your API key.";
  }

  return message;
}

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
    providerName = providerManager.resolveProviderName(provider);

    const selectedProvider = providerManager.getActiveProvider(providerName);

    const resolvedModel = modelManager.resolveModel(providerName, model);

    modelName = resolvedModel.name;

    const output = await selectedProvider.generate({
      prompt,
      model: resolvedModel.model,
      options,
    });

    const executionTime = Date.now() - start;

    logger.logRun({
      workflow,
      endpoint,
      provider: providerName,
      prompt,
      response: output,
      model: modelName,
      status: "success",
      executionTime,
    });

    return output;
  } catch (error) {
    const executionTime = Date.now() - start;
    const friendlyError = normalizeAIError(error);

    logger.logRun({
      workflow,
      endpoint,
      provider: providerName || "unknown",
      prompt,
      response: friendlyError,
      model: modelName,
      status: "failed",
      executionTime,
    });

    throw new Error(friendlyError);
  }
}

module.exports = {
  runAI,
};