const express = require("express");
const router = express.Router();

const tokenController = require("../controllers/tokenController");

router.get("/:token", tokenController.getData);

module.exports = router;
