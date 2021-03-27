const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

router.get("/:categoryId/channels", categoryController.getChannels);
router.post("/:categoryId/channels", categoryController.addChannel);
router.use("/:categoryId/rename", categoryController.renameCategory);
router.use("/:categoryId", categoryController.deleteCategory);

module.exports = router;
