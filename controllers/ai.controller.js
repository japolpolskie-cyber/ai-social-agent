// ======================================================
// AI Controller
// ======================================================

const aiRunner = require("../services/aiRunner");
const contextBuilder = require("../services/contextBuilder");
const modelRouter = require("../services/modelRouter");
const promptBuilder = require("../services/promptBuilder");
const responseService = require("../services/responseService");
const templateDiscovery = require("../services/templateDiscovery");
const formatterService = require("../services/formatterService");
const validatorService = require("../services/validatorService");

async function generate(req, res) {
  try {
    const {
      platform,
      type,
      topic,
      tone = "Friendly",
      audience = "General Audience",
      provider,
      model,
    } = req.body;

    if (!platform) {
      return responseService.error(
        res,
        "Platform is required.",
        400
      );
    }

    if (!type) {
      return responseService.error(
        res,
        "Type is required.",
        400
      );
    }

    if (!topic) {
      return responseService.error(
        res,
        "Topic is required.",
        400
      );
    }

    const context = contextBuilder.build({
      platform,
      type,
      topic,
      tone,
      audience,
      provider,
      model,
    });

    const route = modelRouter.route(context);

    const promptResult = promptBuilder.build(context);

    const output = await aiRunner.runAI({
      workflow: `${platform} ${type}`,
      endpoint: "/ai/generate",
      provider: route.provider,
      model: route.model,
      prompt: promptResult.prompt,
    });

    const cleanOutput = formatterService.clean(output);

    const validation = validatorService.validate(
      cleanOutput,
      {
        maxCharacters:
          context.rules?.maxLength || 3000,
        maxHashtags:
          context.rules?.maxHashtags || 8,
        maxEmojis:
          context.rules?.emojiLimit || 10,
        requireCTA:
          Boolean(context.rules?.ctaRequired),
      }
    );

    return responseService.success(res, {
      workflow: `${platform} ${type}`,
      endpoint: "/ai/generate",

      routing: {
        provider: route.provider,
        model: route.model,
        source: route.source,
      },

      template: promptResult.template,
      output: cleanOutput,
      validation,
    });
  } catch (error) {
    return responseService.error(
      res,
      error.message,
      500
    );
  }
}

function getTemplates(req, res) {
  try {
    const templates =
      templateDiscovery.getTemplates();

    return responseService.success(
      res,
      templates
    );
  } catch (error) {
    return responseService.error(
      res,
      error.message,
      500
    );
  }
}

module.exports = {
  generate,
  getTemplates,
};