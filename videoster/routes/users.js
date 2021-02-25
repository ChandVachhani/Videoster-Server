const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.post("/addCategory", userController.addCategory);

router.post(
  "/searchChannels",
  userController.searchChannels,
  userController.searchChannelsById
);

router.post("/searchChannelsById", userController.searchChannelsById);

router.post(
  "/:category/addChannels",
  userController.addChannels,
  userController.addVideos
);

router.post("/addVideos", userController.addVideos);

router.get("/gerCategories", userController.getCategories);

router.get("/:category/getChannels", userController.getChannels);

module.exports = router;
