// ======================================================
// AI Pipeline Integration Test
// ======================================================

const aiPipeline = require(
  "./services/pipeline/aiPipeline"
);

async function runTest() {
  const result = await aiPipeline.execute({
    platform: "facebook",
    type: "caption",
    topic:
      "How AI automation helps small businesses save time",
    tone: "Friendly",
    audience: "Small Business Owners",
    endpoint: "/test/pipeline",
  });

  console.dir(result, {
    depth: null,
    colors: true,
  });
}

runTest().catch((error) => {
  console.error(
    "Pipeline test failed:",
    error.message
  );

  if (error.attempts) {
    console.dir(error.attempts, {
      depth: null,
      colors: true,
    });
  }

  process.exitCode = 1;
});