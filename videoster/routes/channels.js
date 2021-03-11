const express = require("express");
const router = express.Router();

const channelController = require("../controllers/channelController");

router.get("/:channelId/videos", channelController.getVideos);
router.post("/:channelId/videos", channelController.addVideo);

module.exports = router;
