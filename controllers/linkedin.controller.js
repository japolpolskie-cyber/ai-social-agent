const aiRunner = require('../services/aiRunner');
const templateService = require('../services/templateService');
const responseService = require('../services/responseService');

async function generatePost(req, res) {
  console.log('✅ LinkedIn Controller reached');

  try {
    const { topic, tone = 'professional but friendly' } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        error: 'Topic is required.',
      });
    }

    const prompt = templateService.render('linkedin/post', {
      topic,
      tone,
    });

    const output = await aiRunner.runAI({
      workflow: 'LinkedIn Post Generator',
      endpoint: '/linkedin/post',
      prompt,
      model: 'gemini',
    });

    return responseService.success(res, {
      workflow: 'LinkedIn Post Generator',
      output,
    });
  } catch (error) {
    return responseService.error(res, error);
  }
}

module.exports = {
  generatePost,
};