// ======================================================
// Providers Controller
// ======================================================

const config = require("../services/configService");

function getProviders(req, res) {
    const providers = config.getProviders();

    res.json({
        success: true,
        default: providers.defaultProvider,
        enabled: providers.enabledProviders,
        count: providers.enabledProviders.length,
    });
}

module.exports = {
    getProviders,
};