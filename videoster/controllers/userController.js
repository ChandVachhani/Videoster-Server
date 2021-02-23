const categories = require("../models/categories");
const users = require("../models/users");
const channels = require("../models/channels");

const { YT } = require("../apis/YT");

exports.addCategory = async (req, res, next) => {
  let { category } = req.body;
  try {
    category = req.user.userId + "." + category;
    const x = await req.user.createCategory({
      name: category
    });
    res.status(200).json({
      message: "Category Successfully added!"
    });
  }
  catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured!"
    });
  }
}

exports.searchChannels = async (req, res, next) => {
  const { searchWord } = req.body;
  try {
    const result = await YT.get('/search', {
      params: {
        maxResult: 5,
        part: "snippet",
        q: searchWord,
        type: "channel"
      }
    });
    let data = result.data.items;
    data = data.map((item) => {
      return item.id.channelId
    });
    req.body.channelIds = data;
    next();
  }
  catch (err) {
    res.status(401).json({
      message: "Some Error occured in fetching channels from YT!",
      err
    })
  }
}

exports.searchChannelsById = async (req, res, next) => {
  const { channelIds } = req.body;
  try {
    let channels = [];
    for (i in channelIds) {
      channelId = channelIds[i];
      const result = await YT.get('/channels', {
        params: {
          part: "snippet,contentDetails,statistics",
          id: channelId
        }
      });
      let data = result.data.items[0];
      channels.push(data);
    }
    res.status(200).json({
      data: channels
    });
  }
  catch (err) {
    res.status(401).json({
      message: "Some Error occured in fetching channel from YT!",
      err
    })
  }
}

exports.addChannels = async (req, res, next) => {
  // will get channelIds instade of channels and also add videos in this component
  let { category, channels } = req.body;
  try {
    category = req.user.userId + "." + category;
    const requiredCategory = await categories.findOne({
      where: {
        name: category
      }
    });
    if (!requiredCategory) {
      res.status(401).json({
        message: "category Not Found!"
      });
    }
    console.log("==>", requiredCategory);
    for (i in channels) {
      const channel = await requiredCategory.createChannel({
        channelId: channels[i].channelId,
        name: channels[i].name,
        description: channels[i].description,
        avatarDefault: channels[i].avatarDefault,
        avatarHigh: channels[i].avatarHigh,
        viewsCount: channels[i].viewsCount,
        subscribersCount: channels[i].subscribersCount,
        videoCount: channels[i].videoCount
      });
      channel.addCategory(requiredCategory);
    }
    res.status(200).json({
      message: "channels Successfully added!"
    })
  }
  catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured!"
    });
  }
}

exports.addVideos = async (req, res, next) => {
  let { channelId, videos } = req.body;
  try {
    const requiredChannel = await channels.findOne({
      where: {
        channelId
      }
    });
    if (!requiredChannel) {
      res.status(401).json({
        message: "channel Not Found!"
      });
    }
    console.log("==>", requiredChannel);
    for (i in videos) {
      await requiredChannel.createVideo({
        videoId: videos[i].videoId,
        description: videos[i].description,
        avatarDefault: videos[i].avatarDefault,
        avatarHigh: videos[i].avatarHigh,
        title: videos[i].title,
      });
    }
    res.status(200).json({
      message: "Videos Successfully added!"
    })
  }
  catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured!"
    });
  }
}
