// ======================================================
// Puppeteer Smoke Test
// ======================================================

const fs = require(
  "node:fs"
);

const path = require(
  "node:path"
);

const puppeteer = require(
  "puppeteer"
);

// ======================================================
// Configuration
// ======================================================

const outputDirectory =
  path.join(
    __dirname,
    "output"
  );

const screenshotPath =
  path.join(
    outputDirectory,
    "puppeteer-smoke.png"
  );

// ======================================================
// Test
// ======================================================

async function run() {
  fs.mkdirSync(
    outputDirectory,
    {
      recursive:
        true,
    }
  );

  const browser =
    await puppeteer.launch({
      headless:
        true,

      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });

  try {
    const page =
      await browser.newPage();

    await page.setViewport({
      width:
        1280,

      height:
        720,
    });

    await page.setContent(
      `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>AI Social Agent Browser Smoke Test</title>
        </head>
        <body>
          <main>
            <h1>Browser runtime ready</h1>
          </main>
        </body>
      </html>`,
      {
        waitUntil:
          "domcontentloaded",
      }
    );

    const title =
      await page.title();

    if (
      title !==
      "AI Social Agent Browser Smoke Test"
    ) {
      throw new Error(
        "Browser did not render the smoke-test document."
      );
    }

    await page.screenshot({
      path:
        screenshotPath,

      fullPage:
        true,
    });

    console.log({
      success:
        true,

      title,

      screenshot:
        screenshotPath,
    });

    console.log(
      "\nPuppeteer smoke test passed."
    );
  } finally {
    await browser.close();
  }
}

run().catch(
  (error) => {
    console.error(
      "\nPuppeteer smoke test failed."
    );

    console.error(
      error
    );

    process.exitCode =
      1;
  }
);
