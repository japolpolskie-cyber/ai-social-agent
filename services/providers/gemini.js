const ai = require('../ai');

async function generate({ prompt }) {
  return await ai.generateText(prompt);
}

module.exports = {
  generate,
};