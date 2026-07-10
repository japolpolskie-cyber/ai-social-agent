// ======================================================
// Repair Engine Test
// ======================================================

const { processOutput } = require("./services/outputProcessor");

async function runTest() {
  const output = `
AI automation helps small businesses save time. 🤖 🚀

It can automate repetitive tasks, improve customer service,
and help teams focus on higher-value work.

#AI #Automation #SmallBusiness #Productivity
  `.trim();

  const rules = {
    maxLength: 300,
    maxHashtags: 2,
    emojiLimit: 1,
    ctaRequired: true,
  };

  const context = {
    platform: "linkedin",
    type: "post",
    topic: "How AI automation helps small businesses save time",
    tone: "professional but friendly",
    audience: "small business owners",
  };

  const result = await processOutput({
    output,
    rules,
    context,
    provider: "openrouter",
    model: "openrouter-qwen",
    workflow: "Repair Engine Test",
    endpoint: "/test/repair",
  });

  console.dir(result, {
    depth: null,
    colors: true,
  });
}

runTest().catch((error) => {
  console.error("Repair test failed:");
  console.error(error);
  process.exit(1);
});