// ======================================================
// Platform Rules Validator Compatibility Layer
// ======================================================

const validatorService = require("./validatorService");

function validate(output = "", rules = {}) {
  return validatorService.validate(output, rules);
}

module.exports = {
  validate,
  countHashtags: validatorService.countHashtags,
  countEmojis: validatorService.countEmojis,
};