const express = require("express");

const { getProviders } = require("../controllers/providers.controller");

const router = express.Router();

router.get("/", getProviders);

module.exports = router;