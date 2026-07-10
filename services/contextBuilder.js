// ======================================================
// Context Builder
// ======================================================

const platformRules = require("./platformRules");

function build({
  platform = "facebook",
  type = "caption",
  topic,
  tone,
  audience,
  provider,
  model,
}) {
  return {
    platform,
    type,
    topic,
    tone,
    audience,

    routing: {
      requestedProvider: provider || null,
      requestedModel: model || null,
    },

    rules: platformRules.getRules(platform),

    metadata: {
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
    },
  };
}

module.exports = {
  build,
};