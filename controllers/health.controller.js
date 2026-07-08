const responseService = require('../services/responseService');

function health(req, res) {
  return responseService.success(res, {
    status: 'ok',
    service: 'AI Social Agent',
    version: '1.0.0',
    database: 'connected',
    defaultProvider: 'gemini',
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  health,
};