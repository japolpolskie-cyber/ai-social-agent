// ======================================================
// Groq Client
// ======================================================

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function generateText({ prompt, model, options = {} }) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing.");
  }

  if (!model) {
    throw new Error("Groq model is required.");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options.temperature ?? 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Groq request failed.");
  }

  return data.choices?.[0]?.message?.content || "";
}

module.exports = {
  generateText,
};