const ai = require('./services/ai');

(async () => {
  const result = await ai.generateText('Give me 3 short ideas for AI automation portfolio projects.');
  console.log(result);
})();