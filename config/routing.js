// ======================================================
// Model Routing Configuration
// ======================================================

module.exports = {
  defaultRoute: {
    provider: "gemini",
    model: "gemini-flash",
  },

  routes: {
    linkedin: {
      post: {
        provider: "gemini",
        model: "gemini-flash",
      },

      caption: {
        provider: "groq",
        model: "groq-llama",
      },
    },

    facebook: {
      caption: {
        provider: "groq",
        model: "groq-llama",
      },
    },

    instagram: {
      caption: {
        provider: "groq",
        model: "groq-llama",
      },
    },

    developer: {
      code: {
        provider: "openrouter",
        model: "openrouter-qwen",
      },
    },
  },
};