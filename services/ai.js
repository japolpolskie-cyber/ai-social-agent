// ======================================================
// Legacy AI Service
// ======================================================
//
// This service now delegates to aiRunner.
// Do not call provider SDKs directly here.
// Do not hardcode models here.
// ======================================================

const aiRunner = require("./aiRunner");

async function generateText(prompt, options = {}) {
  return aiRunner.runAI({
    workflow: options.workflow || "Legacy AI Text Generation",
    endpoint: options.endpoint || "services/ai.js",
    provider: options.provider,
    model: options.model,
    prompt,
    options: options.aiOptions || {},
  });
}

async function summarize(text, options = {}) {
  return generateText(
    `
Summarize this text in simple, clear bullet points:

${text}
    `.trim(),
    {
      ...options,
      workflow: options.workflow || "Legacy AI Summarizer",
    }
  );
}

async function generateCaption(text, options = {}) {
  return generateText(
    `
Create a short social media caption based on this:

${text}
    `.trim(),
    {
      ...options,
      workflow: options.workflow || "Legacy Caption Generator",
    }
  );
}

module.exports = {
  generateText,
  summarize,
  generateCaption,
};