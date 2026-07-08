const templateService = require('./templateService');
const platformRules = require('./platformRules');

function build({
  platform = 'facebook',
  topic,
  tone,
  audience,
}) {
  const rules = platformRules.getRules(platform);

  const prompt = templateService.render(
    `${platform}/caption`,
    {
      topic,
      tone,
      audience,
      rules,
    }
  );

  return {
    prompt,
    rules,
  };
}

module.exports = {
  build,
};