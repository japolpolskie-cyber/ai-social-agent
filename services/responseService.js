// ======================================================
// Response Service
// ======================================================

function success(res, data = {}, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    ...data,
  });
}

function normalizeError(error) {
  if (!error) {
    return {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    };
  }

  if (typeof error.toJSON === "function") {
    return error.toJSON();
  }

  return {
    code:
      error.code ||
      "INTERNAL_SERVER_ERROR",

    message:
      error.message ||
      String(error),

    ...(error.stage
      ? { stage: error.stage }
      : {}),

    ...(error.details !== undefined &&
    error.details !== null
      ? { details: error.details }
      : {}),
  };
}

function error(
  res,
  errorValue,
  statusCode = 500
) {
  const safeStatusCode =
    Number.isInteger(statusCode) &&
    statusCode >= 400 &&
    statusCode <= 599
      ? statusCode
      : 500;

  const publicError =
    normalizeError(errorValue);

  console.error("❌ Error:", {
    code: publicError.code,
    message: publicError.message,
    stage: publicError.stage || null,
    statusCode: safeStatusCode,
  });

  return res.status(safeStatusCode).json({
    success: false,
    error: publicError,
  });
}

module.exports = {
  success,
  error,
};