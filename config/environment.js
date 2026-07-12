// ======================================================
// Environment Configuration
// ======================================================

require(
  "dotenv"
).config();

// ======================================================
// Helpers
// ======================================================

function normalizeString(
  value,
  fallback = ""
) {
  if (
    typeof value !==
    "string"
  ) {
    return fallback;
  }

  const normalized =
    value.trim();

  return normalized ||
    fallback;
}

function normalizePort(
  value,
  fallback = 3000
) {
  const parsed =
    Number(value);

  if (
    !Number.isInteger(
      parsed
    ) ||
    parsed < 1 ||
    parsed > 65535
  ) {
    return fallback;
  }

  return parsed;
}

// ======================================================
// Environment
// ======================================================

const environment =
  Object.freeze({
    nodeEnvironment:
      normalizeString(
        process.env.NODE_ENV,
        "development"
      ),

    port:
      normalizePort(
        process.env.PORT,
        3000
      ),

    defaultProvider:
      normalizeString(
        process.env.DEFAULT_PROVIDER,
        "gemini"
      ),

    providers:
      Object.freeze({
        gemini:
          Object.freeze({
            apiKey:
              normalizeString(
                process.env
                  .GEMINI_API_KEY
              ),

            model:
              normalizeString(
                process.env
                  .GEMINI_MODEL,
                "gemini-2.5-flash"
              ),
          }),

        groq:
          Object.freeze({
            apiKey:
              normalizeString(
                process.env
                  .GROQ_API_KEY
              ),

            model:
              normalizeString(
                process.env
                  .GROQ_MODEL,
                "llama-3.1-8b-instant"
              ),
          }),

        openrouter:
          Object.freeze({
            apiKey:
              normalizeString(
                process.env
                  .OPENROUTER_API_KEY
              ),

            model:
              normalizeString(
                process.env
                  .OPENROUTER_MODEL,
                "qwen/qwen3-coder:free"
              ),

            siteUrl:
              normalizeString(
                process.env
                  .OPENROUTER_SITE_URL,
                "http://localhost:3000"
              ),

            appName:
              normalizeString(
                process.env
                  .OPENROUTER_APP_NAME,
                "AI Social Agent"
              ),
          }),
      }),
  });

// ======================================================
// Export
// ======================================================

module.exports =
  environment;