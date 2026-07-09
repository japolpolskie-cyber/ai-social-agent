// ======================================================
// Version Controller
// ======================================================

const config = require("../services/configService");

function getVersion(req, res) {
    const app = config.getApp();
    const providers = config.getProviders();

    res.json({
        success: true,
        name: app.name,
        version: app.version,
        author: app.author,
        environment: app.environment,
        provider: providers.defaultProvider,
    });
}

module.exports = {
    getVersion,
};