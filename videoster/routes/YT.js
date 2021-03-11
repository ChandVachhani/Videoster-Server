const express = require("express");
const router = express.Router();

const ytController = require("../controllers/ytController");

router.get("/channels/:searchword", ytController.getChannels);
router.get("/channel/:channelId", ytController.getChannel);
router.get("/channels/:channelId/videos", ytController.getVideos);

module.exports = router;
