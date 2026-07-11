// ======================================================
// Execution Statistics
// ======================================================

// ======================================================
// Helpers
// ======================================================

function normalizeRecords(records) {
  return Array.isArray(records)
    ? records
    : [];
}

function incrementCounter(
  counters,
  key
) {
  if (
    typeof key !== "string" ||
    key.trim().length === 0
  ) {
    return;
  }

  const normalizedKey =
    key.trim();

  counters[normalizedKey] =
    (
      counters[normalizedKey] ||
      0
    ) + 1;
}

function calculatePercentage(
  value,
  total
) {
  if (
    total <= 0
  ) {
    return 0;
  }

  return Number(
    (
      value /
      total *
      100
    ).toFixed(2)
  );
}

function calculateAverageDuration(
  records
) {
  const durations =
    records
      .map(
        (record) =>
          record.duration
      )
      .filter(
        (duration) =>
          typeof duration ===
            "number" &&
          Number.isFinite(
            duration
          ) &&
          duration >= 0
      );

  if (
    durations.length === 0
  ) {
    return 0;
  }

  const totalDuration =
    durations.reduce(
      (
        total,
        duration
      ) =>
        total +
        duration,
      0
    );

  return Math.round(
    totalDuration /
    durations.length
  );
}

// ======================================================
// Factory
// ======================================================

function createExecutionStatistics(
  records = []
) {
  const normalizedRecords =
    normalizeRecords(
      records
    );

  const total =
    normalizedRecords.length;

  let success = 0;
  let failed = 0;

  const providers = {};
  const models = {};
  const pipelines = {};

  normalizedRecords.forEach(
    (record) => {
      if (
        record.status ===
        "success"
      ) {
        success += 1;
      }

      if (
        record.status ===
        "failed"
      ) {
        failed += 1;
      }

      incrementCounter(
        pipelines,
        record.pipeline
      );

      incrementCounter(
        providers,
        record.metadata
          ?.provider
      );

      incrementCounter(
        models,
        record.metadata
          ?.model
      );
    }
  );

  return Object.freeze({
    total,

    success,

    failed,

    successRate:
      calculatePercentage(
        success,
        total
      ),

    failureRate:
      calculatePercentage(
        failed,
        total
      ),

    averageDuration:
      calculateAverageDuration(
        normalizedRecords
      ),

    providers:
      Object.freeze({
        ...providers,
      }),

    models:
      Object.freeze({
        ...models,
      }),

    pipelines:
      Object.freeze({
        ...pipelines,
      }),
  });
}

module.exports = {
  createExecutionStatistics,
};