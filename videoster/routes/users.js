const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.post("/addCategory", userController.addCategory);
router.post("/searchChannels", userController.searchChannels, userController.searchChannelsById);
router.post("/searchChannelsById", userController.searchChannelsById);
router.post("/addChannels", userController.addChannels);
router.post("/addVideos", userController.addVideos);


module.exports = router;
