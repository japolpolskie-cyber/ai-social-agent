// ======================================================
// Pipeline Definition Test
// ======================================================

const aiGenerationPipeline = require(
  "./services/pipeline/definitions/aiGenerationPipeline"
);

function runTest() {
  const expectedStages = [
    "validate-input",
    "build-context",
    "route-model",
    "build-prompt",
    "execute-ai",
    "process-output",
  ];

  const actualStages =
    aiGenerationPipeline.stages.map(
      (stage) => stage.name
    );

  const identityValid =
    aiGenerationPipeline.name ===
      "ai-generation" &&
    aiGenerationPipeline.version ===
      "1.0.0";

  const stageOrderValid =
    JSON.stringify(actualStages) ===
    JSON.stringify(expectedStages);

  const stageContractValid =
    aiGenerationPipeline.stages.every(
      (stage) =>
        typeof stage.name === "string" &&
        typeof stage.execute === "function"
    );

  const immutabilityValid =
    Object.isFrozen(aiGenerationPipeline) &&
    Object.isFrozen(
      aiGenerationPipeline.stages
    ) &&
    Object.isFrozen(
      aiGenerationPipeline.metadata
    );

  console.log({
    identityValid,
    stageOrderValid,
    stageContractValid,
    immutabilityValid,
    definition: {
      name: aiGenerationPipeline.name,
      version: aiGenerationPipeline.version,
      description:
        aiGenerationPipeline.description,
      stages: actualStages,
      metadata:
        aiGenerationPipeline.metadata,
    },
  });

  if (!identityValid) {
    throw new Error(
      "Pipeline definition identity is invalid."
    );
  }

  if (!stageOrderValid) {
    throw new Error(
      "Pipeline stage order is invalid."
    );
  }

  if (!stageContractValid) {
    throw new Error(
      "Pipeline stage contract is invalid."
    );
  }

  if (!immutabilityValid) {
    throw new Error(
      "Pipeline definition must be immutable."
    );
  }

  console.log(
    "\nPipeline definition test passed."
  );
}

try {
  runTest();
} catch (error) {
  console.error(
    "\nPipeline definition test failed:"
  );

  console.error(error);

  process.exitCode = 1;
}