const express = require("express");

const {
  getProviders,
  getProviderHealth,
} = require("../controllers/providers.controller");

const router = express.Router();

router.get("/", getProviders);
router.get("/health", getProviderHealth);

module.exports = router;