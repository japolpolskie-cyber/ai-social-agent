// ======================================================
// App Configuration
// ======================================================

const packageMetadata = require(
  "../package.json"
);

module.exports = Object.freeze({
  name: "AI Social Agent",
  version: packageMetadata.version,
  author: "Paul Perez",
  environment:
    process.env.NODE_ENV ||
    "development",
});
