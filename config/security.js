// ======================================================
// Security Configuration
// ======================================================

function normalizeBoolean(
  value,
  fallback = false
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  const normalized =
    String(value)
      .trim()
      .toLowerCase();

  if (
    [
      "true",
      "1",
      "yes",
      "on",
    ].includes(
      normalized
    )
  ) {
    return true;
  }

  if (
    [
      "false",
      "0",
      "no",
      "off",
    ].includes(
      normalized
    )
  ) {
    return false;
  }

  return fallback;
}

function normalizeString(
  value,
  fallback = ""
) {
  if (
    typeof value !== "string"
  ) {
    return fallback;
  }

  return (
    value.trim() ||
    fallback
  );
}

const securityConfig =
  Object.freeze({
    apiAuthentication:
      Object.freeze({
        enabled:
          normalizeBoolean(
            process.env
              .API_AUTH_ENABLED,
            false
          ),

        headerName:
          "x-api-key",

        apiKey:
          normalizeString(
            process.env
              .AI_SOCIAL_AGENT_API_KEY
          ),
      }),
  });

module.exports =
  securityConfig;