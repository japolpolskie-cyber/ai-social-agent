// ======================================================
// In-Memory Pipeline Execution Store
// ======================================================

const {
  createExecutionStore,
} = require(
  "./createExecutionStore"
);

// ======================================================
// Validation
// ======================================================

function validateRecord(record) {
  if (
    !record ||
    typeof record !== "object" ||
    Array.isArray(record)
  ) {
    throw new TypeError(
      "Execution store requires a valid execution record."
    );
  }

  if (
    typeof record.executionId !==
      "string" ||
    record.executionId.trim().length ===
      0
  ) {
    throw new TypeError(
      "Execution record must provide a valid executionId."
    );
  }

  return record;
}

function normalizeExecutionId(
  executionId
) {
  if (
    typeof executionId !== "string" ||
    executionId.trim().length === 0
  ) {
    return null;
  }

  return executionId.trim();
}

function normalizeListOptions(
  options
) {
  if (
    options === undefined ||
    options === null
  ) {
    return {};
  }

  if (
    typeof options !== "object" ||
    Array.isArray(options)
  ) {
    throw new TypeError(
      "Execution store list options must be an object."
    );
  }

  return options;
}

function normalizeLimit(value) {
  if (
    !Number.isInteger(value) ||
    value < 1
  ) {
    return null;
  }

  return value;
}

function normalizeOffset(value) {
  if (
    !Number.isInteger(value) ||
    value < 0
  ) {
    return 0;
  }

  return value;
}

// ======================================================
// Store Factory
// ======================================================

function createMemoryExecutionStore() {
  const records =
    new Map();

  return createExecutionStore({
    async save(record) {
      const validatedRecord =
        validateRecord(
          record
        );

      records.set(
        validatedRecord.executionId,
        validatedRecord
      );

      return validatedRecord;
    },

    async get(executionId) {
      const normalizedId =
        normalizeExecutionId(
          executionId
        );

      if (!normalizedId) {
        return null;
      }

      return (
        records.get(
          normalizedId
        ) ||
        null
      );
    },

    async has(executionId) {
      const normalizedId =
        normalizeExecutionId(
          executionId
        );

      if (!normalizedId) {
        return false;
      }

      return records.has(
        normalizedId
      );
    },

    async list(options = {}) {
      const normalizedOptions =
        normalizeListOptions(
          options
        );

      const pipeline =
        normalizeExecutionId(
          normalizedOptions.pipeline
        );

      const status =
        normalizeExecutionId(
          normalizedOptions.status
        );

      const limit =
        normalizeLimit(
          normalizedOptions.limit
        );

      const offset =
        normalizeOffset(
          normalizedOptions.offset
        );

      let result =
        Array.from(
          records.values()
        );

      if (pipeline) {
        result =
          result.filter(
            (record) =>
              record.pipeline ===
              pipeline
          );
      }

      if (status) {
        result =
          result.filter(
            (record) =>
              record.status ===
              status
          );
      }

      result.sort(
        (left, right) => {
          const leftTime =
            Date.parse(
              left.startedAt ||
              ""
            ) || 0;

          const rightTime =
            Date.parse(
              right.startedAt ||
              ""
            ) || 0;

          return (
            rightTime -
            leftTime
          );
        }
      );

      const sliced =
        limit === null
          ? result.slice(
              offset
            )
          : result.slice(
              offset,
              offset + limit
            );

      return Object.freeze([
        ...sliced,
      ]);
    },

    async count(options = {}) {
        const normalizedOptions =
            normalizeListOptions(
              options
            );

        const pipeline =
            normalizeExecutionId(
              normalizedOptions.pipeline
            );

        const status =
            normalizeExecutionId(
              normalizedOptions.status
            );

        return Array.from(
            records.values()
        ).filter(
            (record) => {
                if (
                    pipeline &&
                    record.pipeline !== pipeline
                ) {
                    return false;
                }

                if (
                    status &&
                    record.status !== status
                ) {
                    return false;
                }

                return true;
            }
        ).length;
    },

    async remove(executionId) {
      const normalizedId =
        normalizeExecutionId(
          executionId
        );

      if (!normalizedId) {
        return false;
      }

      return records.delete(
        normalizedId
      );
    },

    async clear() {
      records.clear();
    },
  });
}

module.exports = {
  createMemoryExecutionStore,
};