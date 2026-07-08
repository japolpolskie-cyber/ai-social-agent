const puppeteer = require('puppeteer');
const db = require('../db');

const url = process.argv[2] || 'https://example.com';

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: 'networkidle2',
    });

    const outputPath = 'output/example.png';

    await page.screenshot({
        path: outputPath,
        fullPage: true,
    });

    console.log('✅ Done:', url);

    db.prepare(`
      INSERT INTO runs (workflow, url, status, output, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      'scraper',
      url,
      'success',
      outputPath,
      new Date().toISOString()
    );

    await browser.close();
})();