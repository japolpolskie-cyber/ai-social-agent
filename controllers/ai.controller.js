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
const { processOutput } = require("../services/outputProcessor");

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

    const workflow = `${platform} ${type}`;
    const endpoint = "/ai/generate";

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

    const generatedOutput = await aiRunner.runAI({
      workflow,
      endpoint,
      provider: route.provider,
      model: route.model,
      prompt: promptResult.prompt,
    });

    const cleanOutput =
      formatterService.clean(generatedOutput);

    const processedResult = await processOutput({
      output: cleanOutput,
      rules: context.rules || {},
      context,
      provider: route.provider,
      model: route.model,
      workflow,
      endpoint,
    });

    return responseService.success(res, {
      workflow,
      endpoint,

      routing: {
        provider: route.provider,
        model: route.model,
        source: route.source,
      },

      template: promptResult.template,

      output: processedResult.output,

      validation: processedResult.validation,

      repair: processedResult.repair,
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