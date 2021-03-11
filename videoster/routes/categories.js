const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

router.get("/:categoryId/chanels", categoryController.getChannels);
router.post("/:categoryId/channels", categoryController.addChannel);

module.exports = router;
