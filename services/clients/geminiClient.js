// ======================================================
// Gemini Client
// ======================================================

require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateText({ prompt, model, options = {} }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  if (!model) {
    throw new Error("Gemini model is required.");
  }

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      temperature: options.temperature ?? 0.7,
    },
  });

  return response.text;
}

module.exports = {
  generateText,
};