const platformRules = require('./platformRules');

function build({
  platform = 'facebook',
  topic,
  tone,
  audience,
}) {
  return {
    platform,
    topic,
    tone,
    audience,
    rules: platformRules.getRules(platform),
    metadata: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
    },
  };
}

module.exports = {
  build,
};