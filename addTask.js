const db = require('./db');

db.prepare(`
  INSERT INTO tasks (workflow, url, status, created_at)
  VALUES (?, ?, ?, ?)
`).run(
  'scraper',
  'https://example.com',
  'pending',
  new Date().toISOString()
);

console.log('✅ Task added!');