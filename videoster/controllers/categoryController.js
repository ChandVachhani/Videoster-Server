const categories = require("../models/categories");
const users = require("../models/users");
const channels = require("../models/channels");
const videos = require("../models/videos");

exports.getChannels = async (req, res, next) => {
  try {
    let givenCategory = req.user.userId + "." + req.params.categoryId;
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

    const requiredChannels = await requiredCategory.getChannels();
    const data = requiredChannels.map((channel) => {
      return {
        channelId: channel.channelId,
        name: channel.name,
        description: channel.description,
        avatarDefault: channel.avatarDefault,
        avatarHigh: channel.avatarHigh,
        viewsCount: channel.viewsCount - 0,
        subscribersCount: channel.subscribersCount - 0,
        videoCount: channel.videoCount - 0,
      };
    });
    res.status(200).json({
      channels: data,
    });
  } catch (err) {
    res.status(401).json({
      message: "Some error occured in getting channels!",
      err,
    });
  }
};

exports.addChannel = async (req, res, next) => {
  try {
    const givenchannel = req.body.channel;
    let givenCategory = req.user.userId + "." + req.params.categoryId;
    if (req.params.categoryId == "General") {
      res.status(401).json({
        message: "You can not add channels in default category!",
      });
    }

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

    let requiredChannel = await channels.findOne({
      where: {
        channelId: givenchannel.channelId,
      },
    });

    const channelData = {
      channelId: givenchannel.channelId,
      name: givenchannel.name,
      description: givenchannel.description,
      avatarDefault: givenchannel.avatarDefault,
      avatarHigh: givenchannel.avatarHigh,
      viewsCount: givenchannel.viewsCount + "",
      subscribersCount: givenchannel.subscribersCount + "",
      videoCount: givenchannel.videoCount + "",
    };

    if (!requiredChannel) {
      const gotChannel = await requiredCategory.createChannel({
        ...channelData,
      });
      await gotChannel.addCategory(requiredCategory);
    } else {
      await requiredChannel.addCategory(requiredCategory);
      await requiredChannel.update({
        ...channelData,
      });
    }
    res.status(200).json({
      message: "Successfully added channel!",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured in addchannels!",
    });
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    let givenCategory = req.user.userId + "." + req.params.categoryId;
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
    await requiredCategory.destroy();
    res.status(200).json({
      message: "successfully removed category :)",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured in remove category!",
    });
  }
};
