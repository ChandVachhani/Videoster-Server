const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

router.get("/:categoryId/channels", categoryController.getChannels);
router.post("/:categoryId/channels", categoryController.addChannel);

module.exports = router;
