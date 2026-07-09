// ======================================================
// Provider Health Service
// ======================================================

const providerRegistry = require("./providers");
const providerManager = require("./providerManager");
const modelManager = require("./modelManager");

const API_KEY_ENV = {
  gemini: "GEMINI_API_KEY",
  groq: "GROQ_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
};

function checkProvider(providerName) {
  const settings = providerManager.getProviderSettings(providerName);
  const apiKeyEnv = API_KEY_ENV[providerName];

  const checks = {
    registered: providerRegistry.hasProvider(providerName),
    enabled: Boolean(settings?.enabled),
    apiKey: apiKeyEnv ? Boolean(process.env[apiKeyEnv]) : false,
    defaultModel: false,
    defaultModelEnabled: false,
  };

  let defaultModel = null;

  try {
    defaultModel = modelManager.getProviderDefaultModelName(providerName);
    checks.defaultModel = Boolean(defaultModel);

    if (defaultModel) {
      checks.defaultModelEnabled = modelManager.isModelEnabled(defaultModel);
    }
  } catch (error) {
    checks.defaultModel = false;
    checks.defaultModelEnabled = false;
  }

  const healthy = Object.values(checks).every(Boolean);

  return {
    name: providerName,
    healthy,
    defaultModel,
    checks,
  };
}

function checkAllProviders() {
  const providers = providerManager.listProviders();

  return providers.map((provider) => checkProvider(provider.name));
}

module.exports = {
  checkProvider,
  checkAllProviders,
};