// ======================================================
// Version Controller
// ======================================================

const appConfig = require("../config/app");
const providerConfig = require("../config/providers");

function getVersion(req, res) {
  res.json({
    success: true,
    name: appConfig.name,
    version: appConfig.version,
    author: appConfig.author,
    environment: appConfig.environment,
    provider: providerConfig.defaultProvider,
  });
}

module.exports = {
  getVersion,
};