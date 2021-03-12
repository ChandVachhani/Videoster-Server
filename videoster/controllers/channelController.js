const categories = require("../models/categories");
const users = require("../models/users");
const channels = require("../models/channels");
const videos = require("../models/videos");

exports.getVideos = async (req, res, next) => {
  try {
    const channelId = req.params.channelId;
    const requiredChannel = await channels.findOne({
      where: {
        channelId,
      },
    });
    if (!requiredChannel) {
      res.status(401).json({
        message: "Channel not found!",
      });
    }

    const requiredVideos = await requiredChannel.getVideos();
    res.status(200).json({
      videos: requiredVideos,
    });
  } catch (err) {
    res.status(401).json({
      message: "Some error occured in getting channels!",
      err,
    });
  }
};

exports.addVideo = async (req, res, next) => {
  try {
    const channelId = req.params.channelId;
    const givenVideo = req.body.video;
    const requiredChannel = await channels.findOne({
      where: {
        channelId,
      },
    });
    if (!requiredChannel) {
      res.status(401).json({
        message: "Channel not found!",
      });
    }

    const requiedVideo = await videos.findOne({
      where: {
        videoId: givenVideo.videoId,
      },
    });
    const videoData = {
      videoId: givenVideo.videoId,
      description: givenVideo.description,
      avatarDefault: givenVideo.avatarDefault,
      avatarHigh: givenVideo.avatarHigh,
      avatarMedium: givenVideo.avatarMedium,
      title: givenVideo.title,
    };
    if (!requiedVideo) {
      await requiredChannel.createVideo({
        ...videoData,
      });
    } else {
      await requiedVideo.update({
        ...videoData,
      });
    }
    res.status(200).json({
      message: "Successfully Video added!",
    });
  } catch (err) {
    res.status(401).json({
      message: "Some error occured in getting channels!",
      err,
    });
  }
};

exports.deleteChannel = async (req, res, next) => {
  try {
    let givenCategory = req.user.userId + "." + req.data.category;
    const requiredCategory = await categories.findOne({
      where: {
        name: givenCategory,
      },
    });
    if (!requiredCategory) {
      res.status(401).json({
        message: "Category not found!",
      });
    }

    let givenChannelId = req.params.channelId;
    const requiredChannel = await channels.findOne({
      where: {
        channelId: givenChannelId,
      },
    });
    if (!requiredChannel) {
      res.status(401).json({
        message: "channel not found!",
      });
    }

    await requiredCategory.removeChannel(requiredChannel);
    res.status(200).json({
      message: "successfully removed channel :)",
    });
  } catch (err) {
    res.status(401).json({
      message: "Some error occured in deleting channel!",
      err,
    });
  }
};
