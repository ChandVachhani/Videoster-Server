const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/Login", authController.Login);
router.post("/Register", authController.Register);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/changePassword", authController.changePassword);
router.post("/varifyEmail", authController.varifyEmail);

module.exports = router;
