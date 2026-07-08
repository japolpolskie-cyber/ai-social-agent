function removeMarkdown(text = '') {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`{1,3}/g, '')
    .replace(/^#{1,6}\s+(?=\S)/gm, '')
    .replace(/^---+$/gm, '')
    .replace(/^\s*[-*]\s+/gm, '• ');
}

function cleanWhitespace(text = '') {
  return text
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function clean(text = '') {
  let output = text;

  output = removeMarkdown(output);
  output = cleanWhitespace(output);

  return output;
}

module.exports = {
  clean,
  removeMarkdown,
  cleanWhitespace,
};