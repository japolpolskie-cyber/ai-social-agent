// ======================================================
// Pipeline Resolution Error
// ======================================================

class PipelineResolutionError extends Error {
  constructor(
    message,
    {
      requestedPipeline = null,
      resolvedPipeline = null,
      availablePipelines = [],
      reason = "resolution_failed",
      cause = null,
    } = {}
  ) {
    super(message);

    this.name =
      "PipelineResolutionError";

    this.code =
      "PIPELINE_RESOLUTION_ERROR";

    this.statusCode = 404;

    this.requestedPipeline =
      requestedPipeline;

    this.resolvedPipeline =
      resolvedPipeline;

    this.availablePipelines =
      Array.isArray(availablePipelines)
        ? [...availablePipelines]
        : [];

    this.reason = reason;

    if (cause) {
      this.cause = cause;
    }

    Error.captureStackTrace?.(
      this,
      PipelineResolutionError
    );
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      reason: this.reason,

      requestedPipeline:
        this.requestedPipeline,

      resolvedPipeline:
        this.resolvedPipeline,

      availablePipelines: [
        ...this.availablePipelines,
      ],
    };
  }
}

module.exports = {
  PipelineResolutionError,
};