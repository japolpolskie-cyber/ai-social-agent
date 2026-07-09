const express = require("express");

const { getSystem } = require("../controllers/system.controller");

const router = express.Router();

router.get("/", getSystem);

module.exports = router;