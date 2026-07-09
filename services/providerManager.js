// ======================================================
// Provider Manager v2
// ======================================================

const { getProvider } = require("./providers");
const configService = require("./configService");

function getDefaultProviderName() {
  const providersConfig = configService.getProviders();

  return providersConfig.defaultProvider;
}

function getEnabledProviders() {
  const providersConfig = configService.getProviders();

  return providersConfig.enabledProviders || [];
}

function isProviderEnabled(providerName) {
  const enabledProviders = getEnabledProviders();

  return enabledProviders.includes(providerName);
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
  const enabledProviders = getEnabledProviders();
  const defaultProvider = getDefaultProviderName();

  return enabledProviders.map((providerName) => ({
    name: providerName,
    enabled: true,
    default: providerName === defaultProvider,
  }));
}

module.exports = {
  getDefaultProviderName,
  getEnabledProviders,
  isProviderEnabled,
  resolveProviderName,
  getActiveProvider,
  listProviders,
};