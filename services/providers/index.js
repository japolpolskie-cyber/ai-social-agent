// ======================================================
// Provider Registry
// ======================================================

const gemini = require("./gemini");

const providers = {
  gemini,
};

function getProvider(name) {
  return providers[name] || null;
}

function hasProvider(name) {
  return Object.prototype.hasOwnProperty.call(providers, name);
}

function getAllProviders() {
  return providers;
}

function getProviderNames() {
  return Object.keys(providers);
}

module.exports = {
  getProvider,
  hasProvider,
  getAllProviders,
  getProviderNames,
};