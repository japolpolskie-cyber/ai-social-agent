function countHashtags(text = '') {
  const matches = text.match(/#[a-zA-Z0-9_]+/g);
  return matches ? matches.length : 0;
}

function countEmojis(text = '') {
  const matches = text.match(/\p{Emoji_Presentation}/gu);
  return matches ? matches.length : 0;
}

function hasCTA(text = '') {
  const ctaWords = [
    'comment',
    'share',
    'follow',
    'message',
    'contact',
    'click',
    'learn more',
    'what do you think',
    'share your thoughts',
  ];

  const lowerText = text.toLowerCase();

  return ctaWords.some((word) => lowerText.includes(word));
}

function detectMarkdown(text = '') {
  return /(\*\*|__|```|^#{1,6}\s)/m.test(text);
}

function validate(text = '', options = {}) {
  const {
    maxCharacters = 3000,
    maxHashtags = 8,
    maxEmojis = 10,
    requireCTA = false,
  } = options;

  const characterCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const hashtagCount = countHashtags(text);
  const emojiCount = countEmojis(text);
  const ctaDetected = hasCTA(text);
  const markdownDetected = detectMarkdown(text);

  const issues = [];

  if (!text.trim()) {
    issues.push('Output is empty.');
  }

  if (characterCount > maxCharacters) {
    issues.push(`Output exceeds ${maxCharacters} characters.`);
  }

  if (hashtagCount > maxHashtags) {
    issues.push(`Too many hashtags. Found ${hashtagCount}, max is ${maxHashtags}.`);
  }

  if (emojiCount > maxEmojis) {
    issues.push(`Too many emojis. Found ${emojiCount}, max is ${maxEmojis}.`);
  }

  if (requireCTA && !ctaDetected) {
    issues.push('CTA is missing.');
  }

  if (markdownDetected) {
    issues.push('Markdown formatting detected.');
  }

  return {
    valid: issues.length === 0,
    characterCount,
    wordCount,
    hashtagCount,
    emojiCount,
    ctaDetected,
    markdownDetected,
    issues,
  };
}

module.exports = {
  validate,
  countHashtags,
  countEmojis,
  hasCTA,
  detectMarkdown,
};