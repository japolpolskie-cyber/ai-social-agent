const express = require('express');
const linkedinController = require('../controllers/linkedin.controller');

const router = express.Router();

router.post('/post', linkedinController.generatePost);

module.exports = router;