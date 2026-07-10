// ======================================================
// Pipeline Error
// ======================================================

class PipelineError extends Error {
  constructor({
    code = "PIPELINE_EXECUTION_FAILED",
    message = "Pipeline execution failed.",
    stage = null,
    statusCode = 500,
    details = null,
    cause = null,
  } = {}) {
    super(message);

    this.name = "PipelineError";
    this.code = code;
    this.stage = stage;
    this.statusCode = statusCode;
    this.details = details;
    this.cause = cause;

    Error.captureStackTrace?.(this, PipelineError);
  }

  toJSON() {
    const error = {
      code: this.code,
      message: this.message,
      stage: this.stage,
    };

    if (this.details !== null && this.details !== undefined) {
      error.details = this.details;
    }

    return error;
  }

  static isPipelineError(error) {
    return error instanceof PipelineError;
  }

  static wrap(error, options = {}) {
    if (PipelineError.isPipelineError(error)) {
      return error;
    }

    return new PipelineError({
      code: options.code || "PIPELINE_EXECUTION_FAILED",
      message: options.message || "Pipeline execution failed.",
      stage: options.stage || null,
      statusCode: options.statusCode || 500,
      details: options.details || null,
      cause: error,
    });
  }
}

module.exports = PipelineError;