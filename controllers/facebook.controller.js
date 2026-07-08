const aiRunner = require('../services/aiRunner');
const responseService = require('../services/responseService');
const promptBuilder = require('../services/promptBuilder');
const rulesValidator = require('../services/rulesValidator');
const contextBuilder = require('../services/contextBuilder');

async function caption(req, res) {
  try {
    const {
      topic,
      tone = 'Friendly',
      audience = 'General Audience',
    } = req.body;

    if (!topic) {
      return responseService.error(
        res,
        'Topic is required.',
        400
      );
    }

    const context = contextBuilder.build({
      platform: 'facebook',
      topic,
      tone,
      audience,
    });

    const { prompt } = promptBuilder.build(context);

    const { rules } = context;

    const output = await aiRunner.runAI({
      workflow: 'Facebook Caption',
      endpoint: '/facebook/caption',
      provider: 'gemini',
      prompt,
    });

    const validation = rulesValidator.validate(output, rules);

    return responseService.success(res, {
      workflow: 'Facebook Caption',
      endpoint: '/facebook/caption',
      provider: 'gemini',
      rules,
      validation,
      output,
    });

  } catch (error) {
    return responseService.error(
      res,
      error.message,
      500
    );
  }
}

module.exports = {
  caption,
};