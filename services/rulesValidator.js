function countHashtags(text = '') {
  const matches = text.match(/#[\w]+/g);
  return matches ? matches.length : 0;
}

function countEmojis(text = '') {
  const matches = text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu);
  return matches ? matches.length : 0;
}

function validate(output = '', rules = {}) {
  const issues = [];

  if (rules.maxLength && output.length > rules.maxLength) {
    issues.push({
      type: 'maxLength',
      message: `Output exceeds max length of ${rules.maxLength} characters.`,
    });
  }

  const hashtagCount = countHashtags(output);

  if (rules.maxHashtags !== undefined && hashtagCount > rules.maxHashtags) {
    issues.push({
      type: 'maxHashtags',
      message: `Output has ${hashtagCount} hashtags. Maximum allowed is ${rules.maxHashtags}.`,
    });
  }

  const emojiCount = countEmojis(output);

  if (rules.emojiLimit !== undefined && emojiCount > rules.emojiLimit) {
    issues.push({
      type: 'emojiLimit',
      message: `Output has ${emojiCount} emojis. Maximum allowed is ${rules.emojiLimit}.`,
    });
  }

  return {
    valid: issues.length === 0,
    issues,
    stats: {
      length: output.length,
      hashtags: hashtagCount,
      emojis: emojiCount,
    },
  };
}

module.exports = {
  validate,
  countHashtags,
  countEmojis,
};