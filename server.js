require("dotenv").config();

const express = require("express");
const cors = require("cors");

const appConfig = require("./config/app");
const serverConfig = require("./config/server");

const healthRoutes = require("./routes/health.routes");
const facebookRoutes = require("./routes/facebook.routes");
const aiRoutes = require("./routes/ai.routes");
const linkedinRoutes = require("./routes/linkedin.routes");
const versionRoutes = require("./routes/version.routes");
const providersRoutes = require("./routes/providers.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    name: appConfig.name,
    version: appConfig.version,
    environment: appConfig.environment,
    status: "running",
  });
});

app.use("/ai", aiRoutes);
app.use("/health", healthRoutes);
app.use("/facebook", facebookRoutes);
app.use("/linkedin", linkedinRoutes);
app.use("/version", versionRoutes);
app.use("/providers", providersRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

app.listen(serverConfig.port, () => {
  console.log(
    `🚀 ${appConfig.name} v${appConfig.version} running at http://localhost:${serverConfig.port}`
  );
});