const aiRunner = require('../services/aiRunner');
const responseService = require('../services/responseService');
const promptBuilder = require('../services/promptBuilder');
const rulesValidator = require('../services/rulesValidator');
const contextBuilder = require('../services/contextBuilder');

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

    const context = contextBuilder.build({
      platform: 'linkedin',
      topic,
      tone,
      audience,
    });

    const { prompt } = promptBuilder.build(context);

    const { rules } = context;

    let output = await aiRunner.runAI({
      workflow: 'LinkedIn Post Generator',
      endpoint: '/linkedin/post',
      prompt,
      model: 'gemini',
    });

    output = output
      .replace(/^Here's.*?:\s*/i, '')
      .replace(/^---\s*/m, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '');

    const hashtags = output.match(/#[\w]+/g) || [];

    if (hashtags.length > 3) {
      const allowedHashtags = hashtags.slice(0, 3);
      output = output.replace(/#[\w]+/g, '');
      output = `${output.trim()}\n\n${allowedHashtags.join(' ')}`;
    }

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