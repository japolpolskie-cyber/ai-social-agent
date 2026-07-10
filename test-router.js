// ======================================================
// Sprint 9 - Model Router Test
// ======================================================

require("dotenv").config();

const contextBuilder = require("./services/contextBuilder");
const modelRouter = require("./services/modelRouter");

function runTest(name, input, expected) {
  try {
    const context = contextBuilder.build(input);
    const route = modelRouter.route(context);

    console.log(`\n=== ${name} ===`);
    console.log("Provider:", route.provider);
    console.log("Model:", route.model);
    console.log("Source:", route.source);

    const passed =
      route.provider === expected.provider &&
      route.model === expected.model &&
      route.source === expected.source;

    console.log("Passed:", passed);

    if (!passed) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(`\n=== ${name} ===`);
    console.error("Passed:", false);
    console.error("Error:", error.message);

    process.exitCode = 1;
  }
}

runTest(
  "LinkedIn Post Configured Route",
  {
    platform: "linkedin",
    type: "post",
    topic: "AI automation",
  },
  {
    provider: "gemini",
    model: "gemini-flash",
    source: "configured_route",
  }
);

runTest(
  "Facebook Caption Configured Route",
  {
    platform: "facebook",
    type: "caption",
    topic: "Small business automation",
  },
  {
    provider: "groq",
    model: "groq-llama",
    source: "configured_route",
  }
);

runTest(
  "Explicit Provider Override",
  {
    platform: "linkedin",
    type: "post",
    topic: "AI automation",
    provider: "openrouter",
  },
  {
    provider: "openrouter",
    model: "openrouter-qwen",
    source: "request",
  }
);

runTest(
  "Explicit Model Override",
  {
    platform: "facebook",
    type: "caption",
    topic: "AI content",
    model: "gemini-flash",
  },
  {
    provider: "gemini",
    model: "gemini-flash",
    source: "request",
  }
);

runTest(
  "Default Route",
  {
    platform: "linkedin",
    type: "article",
    topic: "Fallback routing test",
  },
  {
    provider: "gemini",
    model: "gemini-flash",
    source: "default_route",
  }
);