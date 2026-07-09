// ======================================================
// Providers Controller
// ======================================================

const providerManager = require("../services/providerManager");
const providerHealthService = require("../services/providerHealthService");

function getProviders(req, res) {
  const providers = providerManager.listProviders();
  const enabledProviders = providerManager.getEnabledProviders();

  res.json({
    success: true,
    default: providerManager.getDefaultProviderName(),
    enabled: enabledProviders,
    count: enabledProviders.length,
    providers,
  });
}

function getProviderHealth(req, res) {
  const health = providerHealthService.checkAllProviders();

  res.json({
    success: true,
    providers: health,
  });
}

module.exports = {
  getProviders,
  getProviderHealth,
};