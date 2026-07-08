const aiRunner = require('../services/aiRunner');
const templateService = require('../services/templateService');
const responseService = require('../services/responseService');

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

    const prompt = templateService.render(
      'facebook/caption',
      {
        topic,
        tone,
        audience,
      }
    );

    const output = await aiRunner.runAI({
      workflow: 'Facebook Caption',
      endpoint: '/facebook/caption',
      provider: 'gemini',
      prompt,
    });

    return responseService.success(res, {
      workflow: 'Facebook Caption',
      endpoint: '/facebook/caption',
      provider: 'gemini',
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