// ======================================================
// Prompt Builder
// ======================================================

const templateService = require("./templateService");

function build(context) {
  const templateName = `${context.platform}/${context.type}`;

  const prompt = templateService.render(
    templateName,
    context
  );

  return {
    prompt,
    context,
    template: templateName,
  };
}

module.exports = {
  build,
};