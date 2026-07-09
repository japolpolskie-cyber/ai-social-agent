// ======================================================
// Providers Controller
// ======================================================

const providerManager = require("../services/providerManager");

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

module.exports = {
  getProviders,
};