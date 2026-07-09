// ======================================================
// Provider Registry
// ======================================================

const gemini = require("./gemini");
const groq = require("./groq");

const providers = {
  gemini,
  groq,
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