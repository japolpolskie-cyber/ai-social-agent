// ======================================================
// Groq Provider
// ======================================================

const groqClient = require("../clients/groqClient");

async function generate({ prompt, model, options = {} }) {
  return groqClient.generateText({
    prompt,
    model,
    options,
  });
}

module.exports = {
  name: "groq",
  generate,
};