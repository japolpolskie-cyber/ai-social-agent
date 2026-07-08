const facebookRules = require('../rules/facebook.rules');
const linkedinRules = require('../rules/linkedin.rules');

const rules = {
  facebook: facebookRules,
  linkedin: linkedinRules,
};

function getRules(platform = 'facebook') {
  const key = platform.toLowerCase();

  if (!rules[key]) {
    throw new Error(`Platform "${platform}" is not supported.`);
  }

  return rules[key];
}

module.exports = {
  getRules,
};