// ======================================================
// SQLite Pipeline Execution Store
// ======================================================

const db = require(
  "../../../database/db"
);

const {
  createExecutionStore,
} = require(
  "./createExecutionStore"
);

// ======================================================
// Helpers
// ======================================================

function serialize(value) {
  return JSON.stringify(
    value ?? null
  );
}

function deserialize(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function mapRow(row) {
  if (!row) {
    return null;
  }

  return Object.freeze({
    executionId:
      row.execution_id,

    pipeline:
      row.pipeline,

    pipelineVersion:
      row.pipeline_version,

    status:
      row.status,

    endpoint:
      row.endpoint,

    startedAt:
      row.started_at,

    completedAt:
      row.completed_at,

    duration:
      row.duration,

    completedStages:
      deserialize(
        row.completed_stages
      ) || [],

    stageMetrics:
      deserialize(
        row.stage_metrics
      ) || [],

    metadata:
      deserialize(
        row.metadata
      ) || {},

    error:
      deserialize(
        row.error
      ),
  });
}

// ======================================================
// Statements
// ======================================================

const insertStatement =
  db.prepare(`
INSERT OR REPLACE INTO execution_records(
execution_id,
pipeline,
pipeline_version,
status,
endpoint,
started_at,
completed_at,
duration,
completed_stages,
stage_metrics,
metadata,
error
)
VALUES(
@execution_id,
@pipeline,
@pipeline_version,
@status,
@endpoint,
@started_at,
@completed_at,
@duration,
@completed_stages,
@stage_metrics,
@metadata,
@error
)
`);

const getStatement =
  db.prepare(`
SELECT *
FROM execution_records
WHERE execution_id = ?
`);

const deleteStatement =
  db.prepare(`
DELETE
FROM execution_records
WHERE execution_id = ?
`);

const countStatement =
  db.prepare(`
SELECT COUNT(*) total
FROM execution_records
`);

const clearStatement =
  db.prepare(`
DELETE
FROM execution_records
`);

// ======================================================
// Factory
// ======================================================

function createSQLiteExecutionStore() {
  return createExecutionStore({

    async save(record) {
      insertStatement.run({
        execution_id:
          record.executionId,

        pipeline:
          record.pipeline,

        pipeline_version:
          record.pipelineVersion,

        status:
          record.status,

        endpoint:
          record.endpoint,

        started_at:
          record.startedAt,

        completed_at:
          record.completedAt,

        duration:
          record.duration,

        completed_stages:
          serialize(
            record.completedStages
          ),

        stage_metrics:
          serialize(
            record.stageMetrics
          ),

        metadata:
          serialize(
            record.metadata
          ),

        error:
          serialize(
            record.error
          ),
      });

      return record;
    },

    async get(id) {
      return mapRow(
        getStatement.get(id)
      );
    },

    async has(id) {
      return (
        getStatement.get(id) !=
        null
      );
    },

    async list() {
      const rows =
        db.prepare(`
SELECT *
FROM execution_records
ORDER BY created_at DESC
`).all();

      return Object.freeze(
        rows.map(mapRow)
      );
    },

    async count() {
      return countStatement.get()
        .total;
    },

    async remove(id) {
      const result =
        deleteStatement.run(id);

      return (
        result.changes > 0
      );
    },

    async clear() {
      clearStatement.run();
    },

  });
}

module.exports = {
  createSQLiteExecutionStore,
};