const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/:userId/categories", userController.getCategories);
router.post("/:userId/categories", userController.addCategory);

module.exports = router;
