const fs = require('fs');
const path = require('path');

function render(templateName, variables = {}) {
  const filePath = path.join(
    __dirname,
    '..',
    'templates',
    `${templateName}.md`
  );

  let template = fs.readFileSync(filePath, 'utf8');

  for (const key in variables) {
    template = template.replaceAll(`{{${key}}}`, variables[key]);
  }

  return template;
}

module.exports = {
  render,
};