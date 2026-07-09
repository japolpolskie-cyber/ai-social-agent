const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    defaultProvider: process.env.DEFAULT_PROVIDER || 'gemini',
    providers: ['gemini'],
  });
});

module.exports = router;