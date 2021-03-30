const categories = require("../models/categories");
const users = require("../models/users");
const channels = require("../models/channels");
const videos = require("../models/videos");

exports.getData = async (req, res, next) => {
  try {
    const token = req.params.token;
    const requiredUser = await users.findOne({
      where: {
        token,
      },
    });
    let arr = [];
    if (requiredUser) {
      const result = await requiredUser.getCategories();
      arr.push(...result);
    } else {
      const requiredCategory = await categories.findOne({
        where: {
          token,
        },
      });
      if (requiredCategory.dataValues.name.split(".")[1] == "GENERAL") {
        res.status(401).json({
          message: "You can not access default category!",
        });
      }
      arr.push(requiredCategory);
    }
    let data = {};
    for (ind in arr) {
      if (arr[ind].dataValues.name.split(".")[1] == "GENERAL") {
        continue;
      }
      let requiredChannels = await arr[ind].getChannels();
      data[arr[ind].dataValues.name.split(".")[1]] = [];
      for (i in requiredChannels) {
        data[arr[ind].dataValues.name.split(".")[1]].push({
          channelId: requiredChannels[i].dataValues.channelId,
          name: requiredChannels[i].dataValues.name,
          description: requiredChannels[i].dataValues.description,
          avatarDefault: requiredChannels[i].dataValues.avatarDefault,
          avatarHigh: requiredChannels[i].dataValues.avatarHigh,
          viewsCount: requiredChannels[i].dataValues.viewsCount + "",
          subscribersCount:
            requiredChannels[i].dataValues.subscribersCount + "",
          videoCount: requiredChannels[i].dataValues.videoCount + "",
        });
      }
    }
    res.status(200).json({
      tokenData: data,
      message: "Category Successfully added!",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured in fetching tokens!!",
    });
  }
};
