// ======================================================
// Model Manager
// ======================================================

const configService = require("./configService");

function getModelsConfig() {
  return configService.getModels();
}

function getProviderDefaultModelName(providerName) {
  const config = getModelsConfig();

  return config.defaults[providerName] || null;
}

function getModelSettings(modelName) {
  const config = getModelsConfig();

  return config.models[modelName] || null;
}

function isModelEnabled(modelName) {
  const settings = getModelSettings(modelName);

  return Boolean(settings && settings.enabled);
}

function resolveModel(providerName, requestedModel) {
  const modelName =
    requestedModel || getProviderDefaultModelName(providerName);

  if (!modelName) {
    throw new Error(`No default model configured for provider "${providerName}".`);
  }

  const settings = getModelSettings(modelName);

  if (!settings) {
    throw new Error(`Model "${modelName}" is not supported.`);
  }

  if (!settings.enabled) {
    throw new Error(`Model "${modelName}" is not enabled.`);
  }

  if (settings.provider !== providerName) {
    throw new Error(
      `Model "${modelName}" does not belong to provider "${providerName}".`
    );
  }

  return {
    name: modelName,
    ...settings,
  };
}

function getModelsByProvider(providerName) {
  const config = getModelsConfig();

  return Object.entries(config.models)
    .filter(([, settings]) => settings.provider === providerName)
    .map(([name, settings]) => ({
      name,
      ...settings,
    }));
}

function listModels() {
  const config = getModelsConfig();

  return Object.entries(config.models).map(([name, settings]) => ({
    name,
    provider: settings.provider,
    model: settings.model,
    enabled: Boolean(settings.enabled),
    default: config.defaults[settings.provider] === name,
    useCase: settings.useCase,
  }));
}

module.exports = {
  getModelsConfig,
  getProviderDefaultModelName,
  getModelSettings,
  isModelEnabled,
  resolveModel,
  getModelsByProvider,
  listModels,
};