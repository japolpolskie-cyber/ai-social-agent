// ======================================================
// AI Output Repair Prompt Builder
// ======================================================

function formatIssues(issues = []) {
  if (!Array.isArray(issues) || issues.length === 0) {
    return "- The output failed validation.";
  }

  return issues
    .map((issue, index) => {
      const type = issue.type || "unknownIssue";
      const message = issue.message || "Validation rule was violated.";

      return `${index + 1}. [${type}] ${message}`;
    })
    .join("\n");
}

function formatRules(rules = {}) {
  const entries = Object.entries(rules);

  if (entries.length === 0) {
    return "- No additional platform rules were provided.";
  }

  return entries
    .map(([key, value]) => {
      return `- ${key}: ${JSON.stringify(value)}`;
    })
    .join("\n");
}

function buildRepairPrompt({
  output,
  issues = [],
  rules = {},
  context = {},
}) {
  if (typeof output !== "string" || output.trim().length === 0) {
    throw new Error("Repair prompt requires a non-empty output.");
  }

  const platform = context.platform || "unknown";
  const type = context.type || "content";
  const topic = context.topic || "not provided";
  const tone = context.tone || "not specified";
  const audience = context.audience || "general audience";

  return `
You are an AI content repair engine.

Your task is to repair an existing AI-generated output that failed validation.

IMPORTANT INSTRUCTIONS:
- Fix only the listed validation issues.
- Preserve the original meaning and main message.
- Preserve the requested topic, tone, audience, platform, and content type.
- Do not add explanations, notes, labels, headings, or commentary.
- Return only the repaired content.
- Do not mention that the content was repaired.
- Follow all platform rules exactly.
- Make the smallest reasonable changes required to pass validation.

CONTENT CONTEXT:
- Platform: ${platform}
- Content type: ${type}
- Topic: ${topic}
- Tone: ${tone}
- Audience: ${audience}

VALIDATION ISSUES:
${formatIssues(issues)}

PLATFORM RULES:
${formatRules(rules)}

ORIGINAL OUTPUT:
${output}

REPAIRED OUTPUT:
`.trim();
}

module.exports = {
  buildRepairPrompt,
};