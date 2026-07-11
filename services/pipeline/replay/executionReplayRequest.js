// ======================================================
// Execution Replay Request
// ======================================================

const {
  randomUUID,
} = require(
  "node:crypto"
);

// ======================================================
// Validation Helpers
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

function assertNonEmptyString(
  value,
  field
) {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new TypeError(
      `Execution replay requires a valid "${field}".`
    );
  }

  return value.trim();
}

function assertPlainObject(
  value,
  field
) {
  if (!isPlainObject(value)) {
    throw new TypeError(
      `Execution replay "${field}" must be an object.`
    );
  }

  return value;
}

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
      `Execution replay "${field}" must be JSON serializable.`
    );
  }
}

// ======================================================
// Execution ID
// ======================================================

function createReplayExecutionId() {
  return `replay-${randomUUID()}`;
}

// ======================================================
// Factory
// ======================================================

function createExecutionReplayRequest({
  originalExecutionId,
  requestSnapshot,
  metadata = {},
} = {}) {
  const replayedFrom =
    assertNonEmptyString(
      originalExecutionId,
      "originalExecutionId"
    );

  const snapshot =
    assertPlainObject(
      requestSnapshot,
      "requestSnapshot"
    );

  const pipelineName =
    assertNonEmptyString(
      snapshot.pipelineName,
      "requestSnapshot.pipelineName"
    );

  const input =
    assertPlainObject(
      snapshot.input,
      "requestSnapshot.input"
    );

  const snapshotOptions =
    snapshot.options === undefined ||
    snapshot.options === null
      ? {}
      : assertPlainObject(
          snapshot.options,
          "requestSnapshot.options"
        );

  const snapshotMetadata =
    snapshotOptions.metadata ===
      undefined ||
    snapshotOptions.metadata ===
      null
      ? {}
      : assertPlainObject(
          snapshotOptions.metadata,
          "requestSnapshot.options.metadata"
        );

  const replayMetadata =
    assertPlainObject(
      metadata,
      "metadata"
    );

  const executionId =
    createReplayExecutionId();

  const request =
    cloneSerializable(
      {
        pipelineName,

        input,

        endpoint:
          typeof snapshot.endpoint ===
            "string" &&
          snapshot.endpoint.trim()
            ? snapshot.endpoint.trim()
            : null,

        configuration: {
          executionId,

          metadata: {
            ...snapshotMetadata,
            ...replayMetadata,

            source:
              "replay",

            replayedFrom,

            replayedAt:
              new Date().toISOString(),
          },
        },
      },
      "request"
    );

  return Object.freeze({
    originalExecutionId:
      replayedFrom,

    newExecutionId:
      executionId,

    request:
      Object.freeze(
        request
      ),
  });
}

module.exports = {
  createExecutionReplayRequest,
};