// ======================================================
// Environment
// ======================================================

require("dotenv").config();

// ======================================================
// Dependencies
// ======================================================

const express = require("express");
const cors = require("cors");

const appConfig = require(
  "./config/app"
);

const serverConfig = require(
  "./config/server"
);

const applicationLogger = require(
  "./services/applicationLogger"
);

const {
  registerPipelineSubscribers,
} = require(
  "./services/pipeline/registerPipelineSubscribers"
);

// ======================================================
// Routes
// ======================================================

const healthRoutes = require(
  "./routes/health.routes"
);

const facebookRoutes = require(
  "./routes/facebook.routes"
);

const aiRoutes = require(
  "./routes/ai.routes"
);

const linkedinRoutes = require(
  "./routes/linkedin.routes"
);

const versionRoutes = require(
  "./routes/version.routes"
);

const providersRoutes = require(
  "./routes/providers.routes"
);

const systemRoutes = require(
  "./routes/system.routes"
);

const pipelineRoutes = require(
  "./routes/pipeline.routes"
);

const executionRoutes = require(
  "./routes/execution.routes"
);

const executionAnalyticsRoutes =
  require(
    "./routes/executionAnalytics.routes"
  );

const executionReplayRoutes =
  require(
    "./routes/executionReplay.routes"
  );

// ======================================================
// Application Setup
// ======================================================

const app = express();

registerPipelineSubscribers();

app.use(cors());
app.use(express.json());
app.use(
  express.static("public")
);

// ======================================================
// Root Route
// ======================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    name:
      appConfig.name,
    version:
      appConfig.version,
    environment:
      appConfig.environment,
    status:
      "running",
  });
});

// ======================================================
// Application Routes
// ======================================================

app.use(
  "/ai",
  aiRoutes
);

app.use(
  "/health",
  healthRoutes
);

app.use(
  "/facebook",
  facebookRoutes
);

app.use(
  "/linkedin",
  linkedinRoutes
);

app.use(
  "/version",
  versionRoutes
);

app.use(
  "/providers",
  providersRoutes
);

app.use(
  "/system",
  systemRoutes
);

app.use(
  "/pipelines",
  pipelineRoutes
);

// Must remain before /executions.
app.use(
  "/executions/stats",
  executionAnalyticsRoutes
);

app.use(
  "/executions",
  executionReplayRoutes
);

app.use(
  "/executions",
  executionRoutes
);

// ======================================================
// Not Found Handler
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error:
      "Endpoint not found",
    path:
      req.originalUrl,
  });
});

// ======================================================
// Error Handler
// ======================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    applicationLogger.error(
      "Unhandled application error.",
      {
        method:
          req.method,

        path:
          req.originalUrl,

        error: {
          name:
            error?.name ||
            "Error",

          message:
            error?.message ||
            "Internal server error",

          stack:
            error?.stack ||
            null,
        },
      }
    );

    res
      .status(
        error?.statusCode ||
        500
      )
      .json({
        success: false,

        error:
          error?.message ||
          "Internal server error",
      });
  }
);

// ======================================================
// Server Startup
// ======================================================

app.listen(
  serverConfig.port,
  () => {
    applicationLogger.info(
      `${appConfig.name} server started.`,
      {
        version:
          appConfig.version,

        port:
          serverConfig.port,

        url:
          `http://localhost:${serverConfig.port}`,
      }
    );
  }
);