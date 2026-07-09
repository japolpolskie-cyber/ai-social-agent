// ======================================================
// Configuration Service
// ======================================================

const appConfig = require("../config/app");
const serverConfig = require("../config/server");
const providerConfig = require("../config/providers");
const databaseConfig = require("../config/database");
const modelConfig = require("../config/models");

function getApp() {
  return appConfig;
}

function getServer() {
  return serverConfig;
}

function getProviders() {
  return providerConfig;
}

function getDatabase() {
  return databaseConfig;
}

function getModels() {
  return modelConfig;
}

function getSystemInfo() {
  return {
    app: appConfig,
    server: serverConfig,
    providers: providerConfig,
    database: databaseConfig,
    models: modelConfig,
  };
}

module.exports = {
  getApp,
  getServer,
  getProviders,
  getDatabase,
  getSystemInfo,
  getModels,
};