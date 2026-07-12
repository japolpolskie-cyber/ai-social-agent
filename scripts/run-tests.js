// ======================================================
// AI Social Agent Test Runner
// ======================================================

const fs = require(
  "node:fs"
);

const path = require(
  "node:path"
);

const {
  spawnSync,
} = require(
  "node:child_process"
);

// ======================================================
// Configuration
// ======================================================

const projectRoot =
  path.resolve(
    __dirname,
    ".."
  );

const runAllTests =
  process.argv.includes(
    "--all"
  );

const providerDependentTests =
  new Set([
    "test-fallback.js",
    "test-pipeline.js",
    "test-pipeline-execution-service.js",
    "test-repair.js",
  ]);

const testTimeout =
  Number(
    process.env.TEST_TIMEOUT_MS ||
    120000
  );

// ======================================================
// Terminal Helpers
// ======================================================

const symbols = {
  success:
    "PASS",

  failed:
    "FAIL",

  skipped:
    "SKIP",
};

function writeDivider() {
  console.log(
    "============================================================"
  );
}

function writeHeader() {
  console.log("");

  writeDivider();

  console.log(
    "AI Social Agent Test Runner"
  );

  console.log(
    runAllTests
      ? "Mode: All tests"
      : "Mode: Safe regression"
  );

  writeDivider();

  console.log("");
}

// ======================================================
// Test Discovery
// ======================================================

function discoverTests() {
  return fs
    .readdirSync(
      projectRoot,
      {
        withFileTypes:
          true,
      }
    )
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.startsWith(
          "test-"
        ) &&
        entry.name.endsWith(
          ".js"
        )
    )
    .map(
      (entry) =>
        entry.name
    )
    .sort(
      (
        first,
        second
      ) =>
        first.localeCompare(
          second
        )
    );
}

function isEmptyTest(
  fileName
) {
  const filePath =
    path.join(
      projectRoot,
      fileName
    );

  const content =
    fs.readFileSync(
      filePath,
      "utf8"
    );

  return (
    content.trim().length ===
    0
  );
}

function shouldSkipProviderTest(
  fileName
) {
  return (
    !runAllTests &&
    providerDependentTests.has(
      fileName
    )
  );
}

// ======================================================
// Test Execution
// ======================================================

function runTest(
  fileName
) {
  const startedAt =
    Date.now();

  const result =
    spawnSync(
      process.execPath,
      [
        fileName,
      ],
      {
        cwd:
          projectRoot,

        encoding:
          "utf8",

        timeout:
          testTimeout,

        env: {
          ...process.env,

          NODE_ENV:
            "test",
        },
      }
    );

  const duration =
    Date.now() -
    startedAt;

  const timedOut =
    result.error?.code ===
    "ETIMEDOUT";

  const passed =
    result.status ===
      0 &&
    !result.error;

  return {
    fileName,

    passed,

    timedOut,

    duration,

    status:
      result.status,

    stdout:
      result.stdout ||
      "",

    stderr:
      result.stderr ||
      "",

    error:
      result.error ||
      null,
  };
}

// ======================================================
// Result Output
// ======================================================

function printPassed(
  result
) {
  console.log(
    `[${symbols.success}] ${result.fileName} (${result.duration} ms)`
  );
}

function printSkipped(
  fileName,
  reason
) {
  console.log(
    `[${symbols.skipped}] ${fileName} — ${reason}`
  );
}

function printFailed(
  result
) {
  console.log(
    `[${symbols.failed}] ${result.fileName} (${result.duration} ms)`
  );

  if (
    result.timedOut
  ) {
    console.error(
      `Test exceeded ${testTimeout} ms.`
    );
  }

  if (
    result.stdout.trim()
  ) {
    console.error("");

    console.error(
      "STDOUT:"
    );

    console.error(
      result.stdout.trim()
    );
  }

  if (
    result.stderr.trim()
  ) {
    console.error("");

    console.error(
      "STDERR:"
    );

    console.error(
      result.stderr.trim()
    );
  }

  if (
    result.error &&
    !result.timedOut
  ) {
    console.error("");

    console.error(
      result.error
    );
  }

  console.error("");
}

// ======================================================
// Summary
// ======================================================

function printSummary({
  discovered,
  passed,
  failed,
  skipped,
  duration,
}) {
  console.log("");

  writeDivider();

  console.log(
    "Test Summary"
  );

  writeDivider();

  console.log(
    `Discovered : ${discovered}`
  );

  console.log(
    `Passed     : ${passed}`
  );

  console.log(
    `Failed     : ${failed}`
  );

  console.log(
    `Skipped    : ${skipped}`
  );

  console.log(
    `Duration   : ${duration} ms`
  );

  writeDivider();

  if (
    failed ===
    0
  ) {
    console.log("");

    console.log(
      "MVP REGRESSION PASSED"
    );

    console.log("");
  } else {
    console.log("");

    console.error(
      "MVP REGRESSION FAILED"
    );

    console.log("");
  }
}

// ======================================================
// Main
// ======================================================

function main() {
  writeHeader();

  const startedAt =
    Date.now();

  const tests =
    discoverTests();

  let passed =
    0;

  let failed =
    0;

  let skipped =
    0;

  for (
    const fileName
    of tests
  ) {
    if (
      isEmptyTest(
        fileName
      )
    ) {
      skipped +=
        1;

      printSkipped(
        fileName,
        "empty scaffold"
      );

      continue;
    }

    if (
      shouldSkipProviderTest(
        fileName
      )
    ) {
      skipped +=
        1;

      printSkipped(
        fileName,
        "requires live AI provider; use npm run test:all"
      );

      continue;
    }

    const result =
      runTest(
        fileName
      );

    if (
      result.passed
    ) {
      passed +=
        1;

      printPassed(
        result
      );
    } else {
      failed +=
        1;

      printFailed(
        result
      );
    }
  }

  printSummary({
    discovered:
      tests.length,

    passed,

    failed,

    skipped,

    duration:
      Date.now() -
      startedAt,
  });

  if (
    failed >
    0
  ) {
    process.exitCode =
      1;
  }
}

main();