const gemini = require('./gemini');

const providers = {
  gemini,
};

function getProvider(name = 'gemini') {
  const provider = providers[name];

  if (!provider) {
    throw new Error(`Provider "${name}" is not supported.`);
  }

  return provider;
}

module.exports = {
  getProvider,
};