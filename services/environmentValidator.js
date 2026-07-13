// ======================================================
// Environment Validator
// ======================================================

const environment = require(
  "../config/environment"
);

const securityConfig = require(
  "../config/security"
);

// ======================================================
// Helpers
// ======================================================

function checkRequired(
  name,
  value,
  required = true
) {
  return {
    name,

    required,

    valid:
      !required ||
      (
        typeof value ===
          "string" &&
        value.trim().length > 0
      ),
  };
}

// ======================================================
// Validation
// ======================================================

function validateEnvironment() {
  const checks = [
    checkRequired(
      "NODE_ENV",
      environment.nodeEnvironment
    ),

    checkRequired(
      "PORT",
      String(
        environment.port
      )
    ),

    checkRequired(
      "DEFAULT_PROVIDER",
      environment.defaultProvider
    ),

    checkRequired(
      "GEMINI_API_KEY",
      environment.providers
        .gemini.apiKey
    ),

    checkRequired(
      "GROQ_API_KEY",
      environment.providers
        .groq.apiKey
    ),

    checkRequired(
      "OPENROUTER_API_KEY",
      environment.providers
        .openrouter.apiKey
    ),

    checkRequired(
      "AI_SOCIAL_AGENT_API_KEY",
      securityConfig
        .apiAuthentication
        .apiKey,
      securityConfig
        .apiAuthentication
        .enabled
    ),
  ];

  const failed =
    checks.filter(
      (check) =>
        !check.valid
    );

  return Object.freeze({
    valid:
      failed.length ===
      0,

    checks:
      Object.freeze(
        checks
      ),

    failed:
      Object.freeze(
        failed
      ),
  });
}

// ======================================================
// Export
// ======================================================

module.exports = {
  validateEnvironment,
};
