const db = require("./database/db");

const rows = db.prepare(`
SELECT
    id,
    workflow,
    provider,
    model,
    status,
    execution_time,
    created_at
FROM runs
WHERE workflow LIKE '%Repair%'
ORDER BY id DESC
LIMIT 10
`).all();

console.table(rows);