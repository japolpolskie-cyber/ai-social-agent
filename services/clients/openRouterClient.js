// ======================================================
// OpenRouter Client
// ======================================================

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

async function generateText({ prompt, model, options = {} }) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is missing.");
  }

  if (!model) {
    throw new Error("OpenRouter model is required.");
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_APP_NAME || "AI Social Agent",
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
    console.error("OpenRouter Error:", JSON.stringify(data, null, 2));

    throw new Error(
      data?.error?.message ||
        data?.message ||
        `OpenRouter request failed with status ${response.status}.`
    );
  }

  return data.choices?.[0]?.message?.content || "";
}

module.exports = {
  generateText,
};