// ======================================================
// Provider Configuration
// ======================================================

module.exports = {
  defaultProvider: process.env.DEFAULT_PROVIDER || "gemini",

  fallback: {
    enabled: true,

    order: [
      "gemini",
      "groq",
      "openrouter",
    ],

    policy: {
      rate_limit: true,
      quota: true,
      timeout: true,
      network: true,
      service_unavailable: true,

      authentication: false,
      invalid_request: false,
      configuration: false,
      unknown: false,
    },
  },

  providers: {
    gemini: {
      enabled: true,
    },

    groq: {
      enabled: true,
    },

    openrouter: {
      enabled: true,
    },
  },
};