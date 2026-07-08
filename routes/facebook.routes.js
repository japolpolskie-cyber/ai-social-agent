const express = require('express');
const router = express.Router();

const facebookController = require('../controllers/facebook.controller');

router.post('/caption', facebookController.caption);

module.exports = router;