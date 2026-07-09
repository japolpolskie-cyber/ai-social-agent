// ======================================================
// Configuration Service
// ======================================================

const appConfig = require("../config/app");
const serverConfig = require("../config/server");
const providerConfig = require("../config/providers");
const databaseConfig = require("../config/database");

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

function getSystemInfo() {
  return {
    app: appConfig,
    server: serverConfig,
    providers: providerConfig,
    database: databaseConfig,
  };
}

module.exports = {
  getApp,
  getServer,
  getProviders,
  getDatabase,
  getSystemInfo,
};