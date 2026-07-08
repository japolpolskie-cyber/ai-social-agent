require('dotenv').config();

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateText(prompt) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text;
}

async function summarize(text) {
  return generateText(`
Summarize this text in simple, clear bullet points:

${text}
  `);
}

async function generateCaption(text) {
  return generateText(`
Create a short social media caption based on this:

${text}
  `);
}

module.exports = {
  generateText,
  summarize,
  generateCaption,
};