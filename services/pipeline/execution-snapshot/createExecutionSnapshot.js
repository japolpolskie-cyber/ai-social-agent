// ======================================================
// Pipeline Execution Snapshot Builder
// ======================================================

// ======================================================
// Object Validation
// ======================================================

function isPlainObject(value) {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return false;
  }

  const prototype =
    Object.getPrototypeOf(value);

  return (
    prototype === Object.prototype ||
    prototype === null
  );
}

function assertPlainObject(
  value,
  field
) {
  if (!isPlainObject(value)) {
    throw new TypeError(
      `Execution snapshot "${field}" must be an object.`
    );
  }

  return value;
}

// ======================================================
// String Validation
// ======================================================

function assertNonEmptyString(
  value,
  field
) {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new TypeError(
      `Execution snapshot requires a valid "${field}".`
    );
  }

  return value.trim();
}

function normalizeNullableString(
  value,
  field
) {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  if (typeof value !== "string") {
    throw new TypeError(
      `Execution snapshot "${field}" must be a string or null.`
    );
  }

  const normalized =
    value.trim();

  return normalized || null;
}

// ======================================================
// Serializable Clone
// ======================================================

function cloneSerializable(
  value,
  field
) {
  try {
    return JSON.parse(
      JSON.stringify(value)
    );
  } catch {
    throw new TypeError(
      `Execution snapshot "${field}" must be JSON serializable.`
    );
  }
}

// ======================================================
// Deep Freeze
// ======================================================

function deepFreeze(value) {
  if (
    !value ||
    typeof value !== "object" ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  Object.values(value).forEach(
    deepFreeze
  );

  return Object.freeze(value);
}

// ======================================================
// Builder
// ======================================================

function createExecutionSnapshot({
  pipelineName,
  input = {},
  endpoint = null,
  options = {},
} = {}) {
  const normalizedInput =
    assertPlainObject(
      input,
      "input"
    );

  const normalizedOptions =
    assertPlainObject(
      options,
      "options"
    );

  const normalizedMetadata =
    assertPlainObject(
      normalizedOptions.metadata ||
      {},
      "options.metadata"
    );

  const snapshot =
    cloneSerializable(
      {
        pipelineName:
          assertNonEmptyString(
            pipelineName,
            "pipelineName"
          ),

        input:
          normalizedInput,

        endpoint:
          normalizeNullableString(
            endpoint,
            "endpoint"
          ),

        options: {
          metadata:
            normalizedMetadata,
        },
      },
      "request"
    );

  return deepFreeze(snapshot);
}

module.exports = {
  createExecutionSnapshot,
};