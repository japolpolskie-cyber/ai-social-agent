// ======================================================
// Run Logger
// ======================================================

const db = require("../database/db");

function serialize(value, fallback = "") {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch (error) {
    return fallback;
  }
}

function logRun({
  workflow = "unknown",
  endpoint = "",
  provider = "",
  prompt = "",
  response = "",
  model = "",
  status = "success",
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
    serialize(prompt),
    serialize(response),
    model,
    status,
    executionTime,
    new Date().toISOString()
  );
}

function logRepair({
  workflow = "AI Output Repair",
  endpoint = "",
  provider = "",
  model = "",
  originalOutput = "",
  finalOutput = "",
  originalValidation = null,
  finalValidation = null,
  repair = {},
}) {
  const attempted = Boolean(repair.attempted);
  const repaired = Boolean(repair.repaired);

  let status = "skipped";

  if (attempted && repaired) {
    status = "success";
  } else if (attempted && !repaired) {
    status = "failed";
  }

  const repairContext = {
    event: "output_repair",
    attempted,
    promptVersion: repair.promptVersion || null,
    attempts: repair.attempts || 0,
    originalOutput,
    originalValidation,
  };

  const repairOutcome = {
    repaired,
    finalOutput,
    finalValidation,
    issuesFixed: repair.issuesFixed || [],
    remainingIssues: repair.remainingIssues || [],
  };

  logRun({
    workflow: `${workflow} Repair Summary`,
    endpoint,
    provider,
    model,
    prompt: repairContext,
    response: repairOutcome,
    status,
    executionTime: repair.duration || 0,
  });
}

module.exports = {
  logRun,
  logRepair,
};