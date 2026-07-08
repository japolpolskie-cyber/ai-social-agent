const db = require('./database/db');

const runs = db.prepare(`
  SELECT id, workflow, endpoint, model, status, execution_time, created_at
  FROM runs
  ORDER BY id DESC
  LIMIT 10
`).all();

console.table(runs);