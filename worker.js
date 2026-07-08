const db = require('./db');
const workflows = require('./workflows');

async function runTask(task) {
  const workflow = workflows[task.workflow];

  if (!workflow) {
    console.log(`❌ Unknown workflow: ${task.workflow}`);

    db.prepare(`
      UPDATE tasks SET status = 'failed' WHERE id = ?
    `).run(task.id);

    return;
  }

  await workflow(task);
}

async function loop() {
  const task = db.prepare(`
    SELECT * FROM tasks WHERE status = 'pending' ORDER BY id ASC LIMIT 1
  `).get();

  if (!task) {
    console.log('No pending tasks...');
    return;
  }

  await runTask(task);
}

setInterval(loop, 10000);

console.log('🤖 Worker started. Checking tasks every 10 seconds...');