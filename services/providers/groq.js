// ======================================================
// Groq Provider
// ======================================================

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const DEFAULT_MODEL =
  process.env.GROQ_MODEL || "llama-3.1-8b-instant";

async function generate({ prompt, model = DEFAULT_MODEL }) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing.");
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
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Groq request failed.");
  }

  return data.choices?.[0]?.message?.content || "";
}

module.exports = {
  name: "groq",
  generate,
};