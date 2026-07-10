// ======================================================
// AI Output Repair Configuration
// ======================================================

module.exports = {
  enabled: true,

  promptVersion: "1.0",

  maxAttempts: 1,

  preserveOriginalProvider: true,

  preserveOriginalModel: true,

  returnBestAvailableOutput: true,

  repairableIssues: [
    "emptyOutput",
    "maxLength",
    "maxHashtags",
    "emojiLimit",
    "missingCTA",
    "markdownDetected",
    "hashtagsNotAllowed",
    "emojisNotAllowed",
  ],
};