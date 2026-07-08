const logger = require('./logger');
const { getProvider } = require('./providers');

async function runAI({
  provider = 'gemini',
  workflow = 'AI Workflow',
  endpoint = '',
  prompt = '',
  model = 'gemini',
}) {
  const start = Date.now();

  try {
    const selectedProvider = getProvider(provider);

    if (!selectedProvider) {
      throw new Error(`Provider "${provider}" is not supported.`);
    }

    const output = await selectedProvider.generate({
  prompt,
});
    const executionTime = Date.now() - start;

    logger.logRun({
      workflow,
      endpoint,
      provider,
      prompt,
      response: output,
      model,
      status: 'success',
      executionTime,
    });

    return output;
  } catch (error) {
    const executionTime = Date.now() - start;

    logger.logRun({
      workflow,
      endpoint,
      provider,
      prompt,
      response: error.message,
      model,
      status: 'failed',
      executionTime,
    });

    throw error;
  }
}

module.exports = {
  runAI,
};