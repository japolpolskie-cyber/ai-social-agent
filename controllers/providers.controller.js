// ======================================================
// Providers Controller
// ======================================================

const providerConfig = require("../config/providers");

function getProviders(req, res) {
  res.json({
    success: true,
    default: providerConfig.defaultProvider,
    enabled: providerConfig.enabledProviders,
    count: providerConfig.enabledProviders.length,
  });
}

module.exports = {
  getProviders,
};