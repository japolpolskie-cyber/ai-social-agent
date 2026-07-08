const fs = require('fs');
const path = require('path');

function getTemplates() {
  const templatesPath = path.join(__dirname, '..', 'templates');

  const platforms = fs.readdirSync(templatesPath, {
    withFileTypes: true,
  });

  return platforms
    .filter(item => item.isDirectory())
    .map(platform => {
      const platformPath = path.join(templatesPath, platform.name);

      const types = fs.readdirSync(platformPath)
        .filter(file => file.endsWith('.md'))
        .map(file => file.replace('.md', ''));

      return {
        platform: platform.name,
        types,
      };
    });
}

module.exports = {
  getTemplates,
};