// ======================================================
// Provider Manager v2
// ======================================================

const { getProvider } = require("./providers");
const configService = require("./configService");

function getProvidersConfig() {
  return configService.getProviders();
}

function getDefaultProviderName() {
  const providersConfig = getProvidersConfig();

  return providersConfig.defaultProvider;
}

function getProviderSettings(providerName) {
  const providersConfig = getProvidersConfig();

  return providersConfig.providers[providerName] || null;
}

function getEnabledProviders() {
  const providersConfig = getProvidersConfig();

  return Object.entries(providersConfig.providers)
    .filter(([, settings]) => settings.enabled)
    .map(([providerName]) => providerName);
}

function isProviderEnabled(providerName) {
  const settings = getProviderSettings(providerName);

  return Boolean(settings && settings.enabled);
}

function resolveProviderName(requestedProvider) {
  const providerName = requestedProvider || getDefaultProviderName();

  if (!isProviderEnabled(providerName)) {
    throw new Error(`Provider "${providerName}" is not enabled.`);
  }

  return providerName;
}

function getActiveProvider(requestedProvider) {
  const providerName = resolveProviderName(requestedProvider);

  const provider = getProvider(providerName);

  if (!provider) {
    throw new Error(`Provider "${providerName}" is not supported.`);
  }

  return provider;
}

function listProviders() {
  const providersConfig = getProvidersConfig();
  const defaultProvider = getDefaultProviderName();

  return Object.entries(providersConfig.providers).map(
    ([providerName, settings]) => ({
      name: providerName,
      enabled: Boolean(settings.enabled),
      default: providerName === defaultProvider,
    })
  );
}

module.exports = {
  getProvidersConfig,
  getDefaultProviderName,
  getProviderSettings,
  getEnabledProviders,
  isProviderEnabled,
  resolveProviderName,
  getActiveProvider,
  listProviders,
};