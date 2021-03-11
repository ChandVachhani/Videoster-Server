const categories = require("../models/categories");
const users = require("../models/users");
const channels = require("../models/channels");
const videos = require("../models/videos");

const { YT } = require("../apis/YT");

exports.getChannels = async (req, res, next) => {
  try {
    const searchWord = req.params.searchword;
    const result = await YT.get("/search", {
      params: {
        maxResult: 5,
        part: "snippet",
        q: searchWord,
        type: "channel",
      },
    });

    let data = result.data.items;
    data = data.map((item) => {
      return item.id.channelId;
    });
    res.status(200).json({
      channels: data,
    });
  } catch (err) {
    res.status(401).json({
      message: "Some Error occured in fetching channels from YT!",
      err,
    });
  }
};

exports.getChannel = async (req, res, next) => {
  try {
    const channelId = req.params.channelId;
    const result = await YT.get("/channels", {
      params: {
        part: "snippet,contentDetails,statistics",
        id: channelId,
      },
    });
    let data = result.data.items[0];
    res.status(200).json({
      channel: data,
    });
  } catch (err) {
    res.status(401).json({
      message: "Some Error occured in fetching channel from YT!",
      err,
    });
  }
};

exports.getVideos = async (req, res, next) => {
  try {
    const channelId = req.params.channelId;
    const result = await YT.get("/search", {
      params: {
        part: "snippet",
        channelId,
        maxResult: 2,
        order: "date",
        type: "video",
      },
    });
    data = result.data.items;

    res.status(200).json({
      videos: data,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured in fetching Videos!",
    });
  }
};
