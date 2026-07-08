const fs = require('fs');
const path = require('path');

const rulesDir = path.join(__dirname, '../rules');

function loadRules() {
  const files = fs
    .readdirSync(rulesDir)
    .filter((file) => file.endsWith('.rules.js'));

  const rules = {};

  files.forEach((file) => {
    const rule = require(path.join(rulesDir, file));

    if (!rule.platform) {
      throw new Error(`Rule file "${file}" is missing platform.`);
    }

    rules[rule.platform] = rule;
  });

  return rules;
}

function getRules(platform = 'facebook') {
  const rules = loadRules();
  const key = platform.toLowerCase();

  if (!rules[key]) {
    throw new Error(`Platform "${platform}" is not supported.`);
  }

  return rules[key];
}

module.exports = {
  getRules,
  loadRules,
};