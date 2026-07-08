const puppeteer = require('puppeteer');
const db = require('../db');

async function scraper(task) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(task.url, { waitUntil: 'networkidle2' });

  const outputPath = `output/task-${task.id}.png`;

  await page.screenshot({
    path: outputPath,
    fullPage: true,
  });

  db.prepare(`
    INSERT INTO runs (workflow, url, status, output, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    task.workflow,
    task.url,
    'success',
    outputPath,
    new Date().toISOString()
  );

  db.prepare(`
    UPDATE tasks SET status = 'done' WHERE id = ?
  `).run(task.id);

  await browser.close();

  console.log(`✅ Scraper done task ${task.id}: ${task.url}`);
}

module.exports = scraper;