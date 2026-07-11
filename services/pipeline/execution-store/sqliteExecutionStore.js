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
    INSERT OR REPLACE INTO execution_records (
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
    ) VALUES (
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
    DELETE FROM execution_records
    WHERE execution_id = ?
  `);

const countStatement =
  db.prepare(`
    SELECT COUNT(*) AS total
    FROM execution_records
  `);

const clearStatement =
  db.prepare(`
    DELETE FROM execution_records
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

    async get(executionId) {
      return mapRow(
        getStatement.get(
          executionId
        )
      );
    },

    async has(executionId) {
      return (
        getStatement.get(
          executionId
        ) !== undefined
      );
    },

    async list(options = {}) {
      const where = [];
      const params = [];

      if (options.pipeline) {
        where.push(
          "pipeline = ?"
        );

        params.push(
          options.pipeline
        );
      }

      if (options.status) {
        where.push(
          "status = ?"
        );

        params.push(
          options.status
        );
      }

      let sql = `
        SELECT *
        FROM execution_records
      `;

      if (where.length > 0) {
        sql +=
          ` WHERE ${where.join(" AND ")}`;
      }

      sql +=
        " ORDER BY created_at DESC";

      const hasLimit =
        Number.isInteger(
          options.limit
        ) &&
        options.limit > 0;

      const hasOffset =
        Number.isInteger(
          options.offset
        ) &&
        options.offset >= 0;

      if (hasLimit) {
        sql +=
          " LIMIT ?";

        params.push(
          options.limit
        );
      } else if (hasOffset) {
        sql +=
          " LIMIT -1";
      }

      if (hasOffset) {
        sql +=
          " OFFSET ?";

        params.push(
          options.offset
        );
      }

      const rows =
        db.prepare(sql).all(
          ...params
        );

      return Object.freeze(
        rows.map(
          mapRow
        )
      );
    },

    async count(options = {}) {
      const where = [];
      const params = [];

      if (options.pipeline) {
        where.push(
          "pipeline = ?"
        );

        params.push(
          options.pipeline
        );
      }

      if (options.status) {
        where.push(
          "status = ?"
        );

        params.push(
          options.status
        );
      }

      let sql = `
        SELECT COUNT(*) AS total
        FROM execution_records
      `;

      if (where.length > 0) {
        sql +=
        ` WHERE ${where.join(" AND ")}`;
      }

      return db
        .prepare(sql)
        .get(...params)
        .total;
    },

    async remove(executionId) {
      const result =
        deleteStatement.run(
          executionId
        );

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