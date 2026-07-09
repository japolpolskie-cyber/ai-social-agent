const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'AI Social Agent',
    version: '1.0.0',
    provider: process.env.DEFAULT_PROVIDER || 'gemini',
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;