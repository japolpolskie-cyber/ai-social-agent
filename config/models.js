// ======================================================
// Model Configuration
// ======================================================

module.exports = {
  defaultModel: "groq-llama",

  models: {
    "groq-llama": {
      provider: "groq",
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      enabled: true,
      useCase: "general",
    },

    "openrouter-qwen": {
      provider: "openrouter",
      model: process.env.OPENROUTER_MODEL || "qwen/qwen3-coder:free",
      enabled: false,
      useCase: "general",
    },
  },
};