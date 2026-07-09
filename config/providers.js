// ======================================================
// Provider Configuration
// ======================================================

module.exports = {
  defaultProvider: process.env.DEFAULT_PROVIDER || "gemini",

  providers: {
    gemini: {
      enabled: true,
    },

    groq: {
      enabled: false,
    },

    openrouter: {
      enabled: false,
    },
  },
};