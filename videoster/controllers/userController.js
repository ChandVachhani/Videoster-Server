const categories = require("../models/categories");
const users = require("../models/users");
const channels = require("../models/channels");
const videos = require("../models/videos");

const { YT } = require("../apis/YT");

exports.addCategory = async (req, res, next) => {
  let { category } = req.body;
  try {
    category = req.user.userId + "." + category;
    const x = await req.user.createCategory({
      name: category,
    });
    res.status(200).json({
      message: "Category Successfully added!",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured!",
    });
  }
};

exports.searchChannels = async (req, res, next) => {
  const { searchWord } = req.body;
  try {
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
    req.body.channelIds = data;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Some Error occured in fetching channels from YT!",
      err,
    });
  }
};

exports.searchChannelsById = async (req, res, next) => {
  const { channelIds } = req.body;
  try {
    let requiredChannels = [];
    for (i in channelIds) {
      channelId = channelIds[i];
      const result = await YT.get("/channels", {
        params: {
          part: "snippet,contentDetails,statistics",
          id: channelId,
        },
      });
      let data = result.data.items[0];
      requiredChannels.push(data);
    }
    res.status(200).json({
      data: requiredChannels,
    });
  } catch (err) {
    res.status(401).json({
      message: "Some Error occured in fetching channel from YT!",
      err,
    });
  }
};

exports.addChannels = async (req, res, next) => {
  let { category } = req.params;
  const givenchannels = req.body.channels;
  try {
    category = req.user.userId + "." + category;
    const requiredCategory = await categories.findOne({
      where: {
        name: category,
      },
    });
    if (!requiredCategory) {
      res.status(401).json({
        message: "category Not Found!",
      });
    }
    let channelIds = [];
    let shouldfetch = [];
    for (i in givenchannels) {
      const requiredChannel = await channels.findOne({
        where: {
          channelId: givenchannels[i].channelId,
        },
      });
      if (!requiredChannel) {
        shouldfetch.push(1);
        const channel = await requiredCategory.createChannel({
          channelId: givenchannels[i].channelId,
          name: givenchannels[i].name,
          description: givenchannels[i].description,
          avatarDefault: givenchannels[i].avatarDefault,
          avatarHigh: givenchannels[i].avatarHigh,
          viewsCount: givenchannels[i].viewsCount,
          subscribersCount: givenchannels[i].subscribersCount,
          videoCount: givenchannels[i].videoCount,
        });
        await channel.addCategory(requiredCategory);
      } else {
        shouldfetch.push(0);
      }
      givenchannels[i] = {
        channelId: givenchannels[i].channelId,
        name: givenchannels[i].name,
        description: givenchannels[i].description,
        avatarDefault: givenchannels[i].avatarDefault,
        avatarHigh: givenchannels[i].avatarHigh,
        viewsCount: givenchannels[i].viewsCount,
        subscribersCount: givenchannels[i].subscribersCount,
        videoCount: givenchannels[i].videoCount,
      };
      channelIds.push(givenchannels[i].channelId);
    }
    req.body.channels = givenchannels;
    req.body.channelIds = channelIds;
    req.body.shouldfetch = shouldfetch;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured in addchannels!",
    });
  }
};

exports.addVideos = async (req, res, next) => {
  const { channelIds, shouldfetch } = req.body;
  const givenChannels = req.body.channels;
  try {
    for (i in channelIds) {
      const channelId = channelIds[i];
      const requiredChannel = await channels.findOne({
        where: {
          channelId,
        },
      });
      if (shouldfetch[i]) {
        const result = await YT.get("/search", {
          params: {
            part: "snippet",
            channelId,
            maxResult: 2,
            order: "date",
            type: "video",
          },
        });
        fetchedVideos = result.data.items;
      } else {
        fetchedVideos = await requiredChannel.getVideos();
      }

      if (!requiredChannel) {
        res.status(401).json({
          message: "channel Not Found!",
        });
      }
      if (shouldfetch[i]) {
        for (ind in fetchedVideos) {
          await requiredChannel.createVideo({
            videoId: fetchedVideos[ind].id.videoId,
            description: fetchedVideos[ind].snippet.description,
            avatarDefault: fetchedVideos[ind].snippet.thumbnails.default.url,
            avatarHigh: fetchedVideos[ind].snippet.thumbnails.high.url,
            title: fetchedVideos[ind].snippet.title,
          });
          fetchedVideos[ind] = {
            videoId: fetchedVideos[ind].id.videoId,
            description: fetchedVideos[ind].snippet.description,
            avatarDefault: fetchedVideos[ind].snippet.thumbnails.default.url,
            avatarHigh: fetchedVideos[ind].snippet.thumbnails.high.url,
            title: fetchedVideos[ind].snippet.title,
          };
        }
      } else {
        for (ind in fetchedVideos) {
          fetchedVideos[ind] = {
            videoId: fetchedVideos[ind].videoId,
            description: fetchedVideos[ind].description,
            avatarDefault: fetchedVideos[ind].avatarDefault,
            avatarHigh: fetchedVideos[ind].avatarHigh,
            title: fetchedVideos[ind].title,
          };
        }
      }
      givenChannels[i].videos = fetchedVideos;
    }
    res.status(200).json({
      message: "Channels and Videos Successfully added!",
      channels: givenChannels,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured in adding Videos!",
    });
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await req.user.getCategories();
    console.log("--", categories);
    res.status(200).json({
      requiredData,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured in fetching categories!",
    });
  }
};

exports.getChannels = async (req, res, next) => {
  try {
    const { category } = req.params;
    category = req.user.userId + "." + category;
    const requiredCategory = await categories.findOne({
      where: {
        name: category,
      },
    });
    if (!requiredCategory) {
      res.status(401).json({
        message: "Some Error Occured in fetching categories!",
      });
    }
    let requiredData = [];
    const requiredChannels = await requiredCategory.getChannels();

    for (j in requiredChannels) {
      const channel = requiredChannels[j];
      const requiredVideos = await channel.getVideos();
      requiredChannels[j] = {
        channelId: channel.channelId,
        name: channel.name,
        description: channel.description,
        avatarDefault: channel.avatarDefault,
        avatarHigh: channel.avatarHigh,
        viewsCount: channel.viewsCount,
        subscribersCount: channel.subscribersCount,
        videoCount: channel.videoCount,
        requiredVideos,
      };
    }
    requiredData = requiredChannels;
    res.status(200).json({
      requiredData,
    });
  } catch (err) {
    res.status(401).json({
      message: "Some error occured in getting channels!",
      err,
    });
  }
};
