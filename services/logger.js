const db = require('../database/db');

function logRun({
  workflow = 'unknown',
  endpoint = '',
  provider = '',
  prompt = '',
  response = '',
  model = '',
  status = 'success',
  executionTime = 0,
}) {
  const stmt = db.prepare(`
    INSERT INTO runs (
      workflow,
      endpoint,
      provider,
      prompt,
      response,
      model,
      status,
      execution_time,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    workflow,
    endpoint,
    provider,
    prompt,
    response,
    model,
    status,
    executionTime,
    new Date().toISOString()
  );
}

module.exports = {
  logRun,
};