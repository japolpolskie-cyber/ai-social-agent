// ======================================================
// AI Output Validator Service
// ======================================================

function countHashtags(text = "") {
  const matches = text.match(/#[a-zA-Z0-9_]+/g);

  return matches ? matches.length : 0;
}

function countEmojis(text = "") {
  const matches = text.match(
    /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu
  );

  return matches ? matches.length : 0;
}

function removeTrailingDecorations(text = "") {
  return text
    .replace(
      /(?:\s|#[a-zA-Z0-9_]+|[\p{Emoji_Presentation}\p{Extended_Pictographic}])+$/gu,
      ""
    )
    .trim();
}

function hasCTA(text = "") {
  const normalizedText = text
    .toLowerCase()
    .replace(/[’]/g, "'")
    .trim();

  const ctaPatterns = [
    /\bcomment\b/,
    /\bshare\b/,
    /\bfollow\b/,
    /\bmessage\b/,
    /\bcontact\b/,
    /\bconnect\b/,
    /\breach out\b/,
    /\bclick\b/,
    /\blearn more\b/,
    /\bget started\b/,
    /\bbook\b/,
    /\bschedule\b/,
    /\bsign up\b/,
    /\bsubscribe\b/,
    /\bdownload\b/,
    /\bvisit\b/,
    /\btry\b/,
    /\breply\b/,
    /\blet me know\b/,
    /\btell me\b/,
    /\bshare your thoughts\b/,
    /\bwhat do you think\b/,
    /\bwhat would you\b/,
    /\bwhat's the first\b/,
    /\bwhich .* would you\b/,
    /\bready to\b/,
    /\bwant to\b/,
    /\bwould you\b/,
    /\bwill you\b/,
    /\bhow would you\b/,
    /\bwhich one\b/,
  ];

  const containsCTAPhrase = ctaPatterns.some((pattern) =>
    pattern.test(normalizedText)
  );

  const contentWithoutTrailingDecorations =
    removeTrailingDecorations(normalizedText);

  const endsWithQuestion =
    /\?\s*$/.test(contentWithoutTrailingDecorations);

  return containsCTAPhrase || endsWithQuestion;
}

function detectMarkdown(text = "") {
  return /(\*\*|__|```|^#{1,6}\s)/m.test(text);
}

function normalizeOptions(options = {}) {
  return {
    maxCharacters:
      options.maxCharacters ??
      options.maxLength ??
      3000,

    maxHashtags:
      options.maxHashtags ??
      8,

    maxEmojis:
      options.maxEmojis ??
      options.emojiLimit ??
      10,

    requireCTA:
      options.requireCTA ??
      options.ctaRequired ??
      false,

    allowMarkdown:
      options.allowMarkdown ??
      false,
  };
}

function validate(text = "", options = {}) {
  const rules = normalizeOptions(options);

  const characterCount = text.length;

  const wordCount = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

  const hashtagCount = countHashtags(text);
  const emojiCount = countEmojis(text);
  const ctaDetected = hasCTA(text);
  const markdownDetected = detectMarkdown(text);

  const issues = [];

  if (!text.trim()) {
    issues.push({
      type: "emptyOutput",
      message: "Output is empty.",
    });
  }

  if (characterCount > rules.maxCharacters) {
    issues.push({
      type: "maxLength",
      message:
        `Output has ${characterCount} characters. ` +
        `Maximum allowed is ${rules.maxCharacters}.`,
    });
  }

  if (hashtagCount > rules.maxHashtags) {
    issues.push({
      type: "maxHashtags",
      message:
        `Output has ${hashtagCount} hashtags. ` +
        `Maximum allowed is ${rules.maxHashtags}.`,
    });
  }

  if (emojiCount > rules.maxEmojis) {
    issues.push({
      type: "emojiLimit",
      message:
        `Output has ${emojiCount} emojis. ` +
        `Maximum allowed is ${rules.maxEmojis}.`,
    });
  }

  if (rules.requireCTA && !ctaDetected) {
    issues.push({
      type: "missingCTA",
      message: "Output is missing a call to action.",
    });
  }

  if (!rules.allowMarkdown && markdownDetected) {
    issues.push({
      type: "markdownDetected",
      message: "Markdown formatting was detected.",
    });
  }

  return {
    valid: issues.length === 0,

    issues,

    stats: {
      characterCount,
      wordCount,
      hashtagCount,
      emojiCount,
      ctaDetected,
      markdownDetected,
    },
  };
}

module.exports = {
  validate,
  countHashtags,
  countEmojis,
  hasCTA,
  detectMarkdown,
};