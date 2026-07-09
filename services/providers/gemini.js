// ======================================================
// Gemini Provider
// ======================================================

const geminiClient = require("../clients/geminiClient");

async function generate({ prompt, model, options = {} }) {
  return await geminiClient.generateText({
    prompt,
    model,
    options,
  });
}

module.exports = {
  name: "gemini",
  generate,
};