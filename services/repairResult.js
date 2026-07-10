// ======================================================
// AI Output Repair Result Factory
// ======================================================

function getIssueTypes(issues = []) {
  if (!Array.isArray(issues)) {
    return [];
  }

  return issues
    .map((issue) => issue?.type)
    .filter(Boolean);
}

function getFixedIssues({
  originalIssues = [],
  remainingIssues = [],
}) {
  const originalTypes = getIssueTypes(originalIssues);
  const remainingTypes = new Set(
    getIssueTypes(remainingIssues)
  );

  return originalTypes.filter(
    (type) => !remainingTypes.has(type)
  );
}

function createRepairResult({
  output,
  validation,
  attempted = false,
  repaired = false,
  attempts = 0,
  originalOutput = null,
  originalValidation = null,
  remainingIssues = [],
  duration = 0,
  promptVersion = "1.0",
}) {
  const issuesFixed = getFixedIssues({
    originalIssues:
      originalValidation?.issues || [],
    remainingIssues,
  });

  return {
    output,
    validation,

    repair: {
      attempted,
      repaired,
      attempts,
      duration,
      promptVersion,
      originalOutput,
      originalValidation,
      issuesFixed,
      remainingIssues,
    },
  };
}

module.exports = {
  createRepairResult,
};