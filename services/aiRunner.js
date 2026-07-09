// ======================================================
// AI Runner
// ======================================================

const logger = require("./logger");
const providerManager = require("./providerManager");

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
  model = "default",
}) {
  const start = Date.now();
  let providerName = provider;

  try {
    providerName = providerManager.resolveProviderName(provider);

    const selectedProvider = providerManager.getActiveProvider(providerName);

    const output = await selectedProvider.generate({
      prompt,
    });

    const executionTime = Date.now() - start;

    logger.logRun({
      workflow,
      endpoint,
      provider: providerName,
      prompt,
      response: output,
      model,
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
      model,
      status: "failed",
      executionTime,
    });

    throw new Error(friendlyError);
  }
}

module.exports = {
  runAI,
};