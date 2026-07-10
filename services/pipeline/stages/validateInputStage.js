// ======================================================
// Validate Input Stage
// ======================================================

function createValidationError(message) {
  const error = new Error(message);

  error.statusCode = 400;

  return error;
}

function execute(context) {
  const {
    platform,
    type,
    topic,
  } = context.input || {};

  if (!platform) {
    throw createValidationError(
      "Platform is required."
    );
  }

  if (!type) {
    throw createValidationError(
      "Type is required."
    );
  }

  if (!topic) {
    throw createValidationError(
      "Topic is required."
    );
  }

  return context;
}

module.exports = {
  name: "validate-input",
  execute,
};