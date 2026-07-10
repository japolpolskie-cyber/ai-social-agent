// ======================================================
// Application Logger
// ======================================================

const winston = require("winston");

const environment =
  process.env.NODE_ENV || "development";

const logLevel =
  process.env.LOG_LEVEL ||
  (environment === "production" ? "info" : "debug");

const logger = winston.createLogger({
  level: logLevel,

  defaultMeta: {
    service: "ai-social-agent",
    environment,
  },

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({
      stack: true,
    }),
    winston.format.json()
  ),

  transports: [
    new winston.transports.Console(),
  ],

  exitOnError: false,
});

module.exports = logger;