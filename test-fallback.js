// ======================================================
// Sprint 8 - Automatic Fallback Engine Test
// ======================================================

require("dotenv").config();

const { executeWithFallback } = require("./services/fallbackEngine");

async function testFallback() {
  console.log("\n=== AUTOMATIC FALLBACK TEST ===\n");

  try {
    const result = await executeWithFallback({
      provider: process.env.TEST_PROVIDER || undefined,
      prompt: "Reply with exactly: Fallback engine working",
    });

    console.log("Success:", true);
    console.log("Provider:", result.provider);
    console.log("Model:", result.model);
    console.log("Output:", result.output);

    console.log("\nAttempts:");

    result.attempts.forEach((attempt, index) => {
      console.log(`${index + 1}.`, attempt);
    });
  } catch (error) {
    console.error("Success:", false);
    console.error("Error:", error.message);

    console.error("\nAttempts:");

    const attempts = Array.isArray(error.attempts)
      ? error.attempts
      : [];

    attempts.forEach((attempt, index) => {
      console.error(`${index + 1}.`, attempt);
    });

    process.exitCode = 1;
  }
}

testFallback();