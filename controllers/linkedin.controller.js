const aiRunner = require('../services/aiRunner');
const responseService = require('../services/responseService');
const promptBuilder = require('../services/promptBuilder');
const rulesValidator = require('../services/rulesValidator');

async function generatePost(req, res) {
  console.log('✅ LinkedIn Controller reached');

  try {
    const {
      topic,
      tone = 'professional but friendly',
      audience = 'Business professionals',
    } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        error: 'Topic is required.',
      });
    }

    const { prompt, rules } = promptBuilder.build({
      platform: 'linkedin',
      topic,
      tone,
      audience,
    });

    const output = await aiRunner.runAI({
      workflow: 'LinkedIn Post Generator',
      endpoint: '/linkedin/post',
      prompt,
      model: 'gemini',
    });

    const validation = rulesValidator.validate(output, rules);

    return responseService.success(res, {
      workflow: 'LinkedIn Post Generator',
      endpoint: '/linkedin/post',
      provider: 'gemini',
      rules,
      validation,
      output,
    });
  } catch (error) {
    return responseService.error(res, error);
  }
}

module.exports = {
  generatePost,
};