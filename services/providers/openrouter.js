// ======================================================
// OpenRouter Provider
// ======================================================

const openRouterClient = require("../clients/openRouterClient");

async function generate({ prompt, model, options = {} }) {
  return openRouterClient.generateText({
    prompt,
    model,
    options,
  });
}

module.exports = {
  name: "openrouter",
  generate,
};