const templateService = require('./templateService');

function build(context) {
  const prompt = templateService.render(
    `${context.platform}/caption`,
    context
  );

  return {
    prompt,
    context,
  };
}

module.exports = {
  build,
};