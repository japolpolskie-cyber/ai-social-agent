const aiRunner = require('../services/aiRunner');
const templateService = require('../services/templateService');
const responseService = require('../services/responseService');
const templateDiscovery = require('../services/templateDiscovery');

async function generate(req, res) {
  try {
    const {
      platform,
      type,
      topic,
      tone = 'Friendly',
      audience = 'General Audience',
      provider = 'gemini',
    } = req.body;

    if (!platform) {
      return responseService.error(res, 'Platform is required.', 400);
    }

    if (!type) {
      return responseService.error(res, 'Type is required.', 400);
    }

    if (!topic) {
      return responseService.error(res, 'Topic is required.', 400);
    }

    const templateName = `${platform}/${type}`;

    const prompt = templateService.render(templateName, {
      topic,
      tone,
      audience,
    });

    const output = await aiRunner.runAI({
      workflow: `${platform} ${type}`,
      endpoint: '/ai/generate',
      provider,
      prompt,
    });

    return responseService.success(res, {
      workflow: `${platform} ${type}`,
      endpoint: '/ai/generate',
      provider,
      template: templateName,
      output,
    });
  } catch (error) {
    return responseService.error(res, error.message, 500);
  }
}

function getTemplates(req, res) {
  try {
    const templates = templateDiscovery.getTemplates();

    return responseService.success(res, templates);
  } catch (error) {
    return responseService.error(res, error.message, 500);
  }
}

module.exports = {
  generate,
  getTemplates,
};