const logger = require("./logger");
const { getProvider } = require("./providers");

function normalizeAIError(error) {
  const message = error?.message || "AI generation failed.";

  if (
    message.includes("429") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.toLowerCase().includes("quota")
  ) {
    return "Gemini quota exceeded. Please try again later or switch provider.";
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
  provider = "gemini",
  workflow = "AI Workflow",
  endpoint = "",
  prompt = "",
  model = "gemini",
}) {
  const start = Date.now();

  try {
    const selectedProvider = getProvider(provider);

    if (!selectedProvider) {
      throw new Error(`Provider "${provider}" is not supported.`);
    }

    const output = await selectedProvider.generate({
      prompt,
    });

    const executionTime = Date.now() - start;

    logger.logRun({
      workflow,
      endpoint,
      provider,
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
      provider,
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