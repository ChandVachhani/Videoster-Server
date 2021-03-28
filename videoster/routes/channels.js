const express = require("express");
const router = express.Router();

const channelController = require("../controllers/channelController");

router.get("/videos", channelController.getVideos);
router.post("/:channelId/videos", channelController.addVideo);
router.use("/:channelId", channelController.deleteChannel);

module.exports = router;
