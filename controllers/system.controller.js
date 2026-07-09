// ======================================================
// System Controller
// ======================================================

const config = require("../services/configService");

function getSystem(req, res) {
    res.json({
        success: true,
        system: config.getSystemInfo(),
    });
}

module.exports = {
    getSystem,
};