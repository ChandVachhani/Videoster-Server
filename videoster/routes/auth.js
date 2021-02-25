const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/Login", authController.Login);

router.post("/Register", authController.Register);

module.exports = router;
