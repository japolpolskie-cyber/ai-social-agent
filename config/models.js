// ======================================================
// Model Configuration
// ======================================================

module.exports = {
  defaults: {
    gemini: "gemini-flash",
    groq: "groq-llama",
    openrouter: "openrouter-qwen",
  },

  models: {
    "gemini-flash": {
      provider: "gemini",
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      enabled: true,
      useCase: "general",
    },

    "groq-llama": {
      provider: "groq",
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      enabled: true,
      useCase: "general",
    },

    "openrouter-qwen": {
      provider: "openrouter",
      model: process.env.OPENROUTER_MODEL || "qwen/qwen3-coder:free",
      enabled: true,
      useCase: "general",
    },
  },
};