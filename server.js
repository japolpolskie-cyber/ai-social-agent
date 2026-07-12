// ======================================================
// Environment
// ======================================================

require(
  "dotenv"
).config();

// ======================================================
// Dependencies
// ======================================================

const express = require(
  "express"
);

const cors = require(
  "cors"
);

const helmet = require(
  "helmet"
);

const compression = require(
  "compression"
);

const {
  rateLimit,
} = require(
  "express-rate-limit"
);

// ======================================================
// Configuration
// ======================================================

const appConfig = require(
  "./config/app"
);

const serverConfig = require(
  "./config/server"
);

const {
  validateEnvironment,
} = require(
  "./services/environmentValidator"
);

// ======================================================
// Services
// ======================================================

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

const monitoringRoutes = require(
  "./routes/monitoring.routes"
);

const dashboardRoutes = require(
  "./routes/dashboard.routes"
);

// ======================================================
// Environment Validation
// ======================================================

function printEnvironmentValidation(
  result
) {
  console.log("");

  console.log(
    "========================================"
  );

  console.log(
    `${appConfig.name} Environment Validation`
  );

  console.log(
    "========================================"
  );

  console.log("");

  result.checks.forEach(
    (check) => {
      const symbol =
        check.valid
          ? "✓"
          : "✗";

      console.log(
        `${symbol} ${check.name}`
      );
    }
  );

  console.log("");

  if (result.valid) {
    console.log(
      "Environment validation passed."
    );

    console.log("");

    return;
  }

  console.error(
    "Environment validation failed."
  );

  console.error("");

  console.error(
    "Missing or invalid environment variables:"
  );

  result.failed.forEach(
    (check) => {
      console.error(
        `- ${check.name}`
      );
    }
  );

  console.error("");

  console.error(
    "Server startup aborted."
  );

  console.error("");
}

const environmentValidation =
  validateEnvironment();

printEnvironmentValidation(
  environmentValidation
);

if (
  !environmentValidation.valid
) {
  process.exit(1);
}

// ======================================================
// CORS Configuration
// ======================================================

function getAllowedOrigins() {
  const configuredOrigins =
    process.env.CORS_ORIGINS;

  if (
    typeof configuredOrigins ===
      "string" &&
    configuredOrigins.trim()
  ) {
    return configuredOrigins
      .split(",")
      .map(
        (origin) =>
          origin.trim()
      )
      .filter(Boolean);
  }

  return [
    `http://localhost:${serverConfig.port}`,
    `http://127.0.0.1:${serverConfig.port}`,
  ];
}

const allowedOrigins =
  getAllowedOrigins();

const corsOptions = {
  origin(
    origin,
    callback
  ) {
    // Requests from n8n, PowerShell, curl, and
    // server-to-server clients normally have no Origin.
    if (!origin) {
      callback(
        null,
        true
      );

      return;
    }

    if (
      allowedOrigins.includes(
        origin
      )
    ) {
      callback(
        null,
        true
      );

      return;
    }

    const error =
      new Error(
        `Origin "${origin}" is not allowed by CORS.`
      );

    error.statusCode =
      403;

    callback(
      error
    );
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials:
    false,

  maxAge:
    86400,
};

// ======================================================
// Rate Limiting
// ======================================================

const apiRateLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit:
      200,

    standardHeaders:
      "draft-8",

    legacyHeaders:
      false,

    message: {
      success:
        false,

      error:
        "Too many requests. Please try again later.",

      code:
        "RATE_LIMIT_EXCEEDED",
    },

    skip(
      req
    ) {
      return (
        req.method ===
          "OPTIONS" ||
        req.path ===
          "/health"
      );
    },
  });

// ======================================================
// Application Setup
// ======================================================

const app =
  express();

if (
  appConfig.environment ===
  "production"
) {
  app.set(
    "trust proxy",
    1
  );
}

app.disable(
  "x-powered-by"
);

registerPipelineSubscribers();

// ======================================================
// Security and Request Middleware
// ======================================================

app.use(
  helmet({
    // The current frontend uses inline styles/scripts
    // in shared layout components. We will tighten CSP
    // separately after removing those inline sections.
    contentSecurityPolicy:
      false,

    crossOriginEmbedderPolicy:
      false,
  })
);

app.use(
  compression({
    threshold:
      1024,
  })
);

app.use(
  cors(
    corsOptions
  )
);

app.use(
  express.json({
    limit:
      "1mb",

    strict:
      true,
  })
);

app.use(
  express.urlencoded({
    extended:
      false,

    limit:
      "1mb",
  })
);

// Apply limits to API endpoints, not static assets.
app.use(
  [
    "/ai",
    "/facebook",
    "/linkedin",
    "/providers",
    "/system",
    "/pipelines",
    "/monitoring",
    "/dashboard",
    "/executions",
  ],

  apiRateLimiter
);

app.use(
  express.static(
    "public",
    {
      dotfiles:
        "ignore",

      etag:
        true,

      index:
        "index.html",

      maxAge:
        appConfig.environment ===
          "production"
          ? "1h"
          : 0,
    }
  )
);

// ======================================================
// Root API Information
// ======================================================

app.get(
  "/api",
  (
    req,
    res
  ) => {
    res.json({
      success:
        true,

      name:
        appConfig.name,

      version:
        appConfig.version,

      environment:
        appConfig.environment,

      status:
        "running",
    });
  }
);

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

app.use(
  "/monitoring",
  monitoringRoutes
);

app.use(
  "/dashboard",
  dashboardRoutes
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

app.use(
  (
    req,
    res
  ) => {
    res
      .status(
        404
      )
      .json({
        success:
          false,

        error:
          "Endpoint not found",

        code:
          "ENDPOINT_NOT_FOUND",

        path:
          req.originalUrl,
      });
  }
);

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
    const statusCode =
      Number.isInteger(
        error?.statusCode
      )
        ? error.statusCode
        : 500;

    applicationLogger.error(
      "Unhandled application error.",
      {
        method:
          req.method,

        path:
          req.originalUrl,

        statusCode,

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

    const exposeMessage =
      appConfig.environment !==
        "production" ||
      statusCode < 500;

    res
      .status(
        statusCode
      )
      .json({
        success:
          false,

        error:
          exposeMessage
            ? (
                error?.message ||
                "Internal server error"
              )
            : "Internal server error",

        code:
          error?.code ||
          (
            statusCode >=
            500
              ? "INTERNAL_SERVER_ERROR"
              : "REQUEST_FAILED"
          ),
      });
  }
);

// ======================================================
// Server Startup
// ======================================================

const server =
  app.listen(
    serverConfig.port,
    () => {
      applicationLogger.info(
        `${appConfig.name} server started.`,
        {
          version:
            appConfig.version,

          environment:
            appConfig.environment,

          port:
            serverConfig.port,

          url:
            `http://localhost:${serverConfig.port}`,

          allowedOrigins,
        }
      );
    }
  );

// ======================================================
// Graceful Shutdown
// ======================================================

let shuttingDown =
  false;

function shutdown(
  signal
) {
  if (shuttingDown) {
    return;
  }

  shuttingDown =
    true;

  applicationLogger.info(
    "Graceful shutdown started.",
    {
      signal,
    }
  );

  const forceShutdownTimer =
    setTimeout(
      () => {
        applicationLogger.error(
          "Graceful shutdown timed out."
        );

        process.exit(1);
      },
      10000
    );

  forceShutdownTimer.unref();

  server.close(
    (error) => {
      if (error) {
        applicationLogger.error(
          "Server shutdown failed.",
          {
            error: {
              name:
                error.name,

              message:
                error.message,

              stack:
                error.stack,
            },
          }
        );

        process.exit(1);
      }

      applicationLogger.info(
        "Server shutdown completed."
      );

      process.exit(0);
    }
  );
}

process.on(
  "SIGINT",
  () =>
    shutdown(
      "SIGINT"
    )
);

process.on(
  "SIGTERM",
  () =>
    shutdown(
      "SIGTERM"
    )
);

process.on(
  "unhandledRejection",
  (reason) => {
    applicationLogger.error(
      "Unhandled promise rejection.",
      {
        reason:
          reason instanceof Error
            ? {
                name:
                  reason.name,

                message:
                  reason.message,

                stack:
                  reason.stack,
              }
            : reason,
      }
    );
  }
);

process.on(
  "uncaughtException",
  (error) => {
    applicationLogger.error(
      "Uncaught exception.",
      {
        error: {
          name:
            error.name,

          message:
            error.message,

          stack:
            error.stack,
        },
      }
    );

    shutdown(
      "uncaughtException"
    );
  }
);