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
  let { category, givenchannels } = req.body;
  console.log(category, givenchannels);
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
    let channelIds = [];
    for (i in givenchannels) {
      const channel = await requiredCategory.createChannel({
        channelId: givenchannels[i].channelId,
        name: givenchannels[i].name,
        description: givenchannels[i].description,
        avatarDefault: givenchannels[i].avatarDefault,
        avatarHigh: givenchannels[i].avatarHigh,
        viewsCount: givenchannels[i].viewsCount,
        subscribersCount: givenchannels[i].subscribersCount,
        videoCount: givenchannels[i].videoCount
      });
      givenchannels[i] = {
        channelId: givenchannels[i].channelId,
        name: givenchannels[i].name,
        description: givenchannels[i].description,
        avatarDefault: givenchannels[i].avatarDefault,
        avatarHigh: givenchannels[i].avatarHigh,
        viewsCount: givenchannels[i].viewsCount,
        subscribersCount: givenchannels[i].subscribersCount,
        videoCount: givenchannels[i].videoCount
      }
      await channel.addCategory(requiredCategory);
      channelIds.push(givenchannels[i].channelId);
    }
    req.body.channels = givenchannels;
    req.body.channelIds = channelIds;
    next();
  }
  catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured in addchannels!"
    });
  }
}

exports.addVideos = async (req, res, next) => {
  const { channelIds } = req.body;
  const givenChannels = req.body.channels;
  try {
    for (i in channelIds) {
      const channelId = channelIds[i];
      const result = await YT.get('/search', {
        params: {
          part: "snippet",
          channelId,
          maxResult: 2,
          order: "date",
          type: "video"
        }
      });
      const fetchedVideos = result.data.items;

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
      for (ind in fetchedVideos) {
        await requiredChannel.createVideo({
          videoId: fetchedVideos[ind].id.videoId,
          description: fetchedVideos[ind].snippet.description,
          avatarDefault: fetchedVideos[ind].snippet.thumbnails.default.url,
          avatarHigh: fetchedVideos[ind].snippet.thumbnails.high.url,
          title: fetchedVideos[ind].snippet.title
        });
        fetchedVideos[ind] = {
          videoId: fetchedVideos[ind].id.videoId,
          description: fetchedVideos[ind].snippet.description,
          avatarDefault: fetchedVideos[ind].snippet.thumbnails.default.url,
          avatarHigh: fetchedVideos[ind].snippet.thumbnails.high.url,
          title: fetchedVideos[ind].snippet.title
        }
      }
      givenChannels[i].videos = fetchedVideos;
    }
    res.status(200).json({
      message: "Channels and Videos Successfully added!",
      channels: givenChannels
    });
  }
  catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured in adding Videos!"
    });
  }
}

exports.getCategories = async (req, res, next) => {
  try {
    let requiredData = {};
    const categories = await req.user.getCategories();
    for (i in categories) {
      const category = categories[i];
      const channels = await category.getChannels();

      for (j in channels) {
        const channel = channels[j];
        const videos = await channel.getVideos();
        channels[j] = {
          channelId: channels[j].channelId,
          name: channels[j].name,
          description: channels[j].description,
          avatarDefault: channels[j].avatarDefault,
          avatarHigh: channels[j].avatarHigh,
          viewsCount: channels[j].viewsCount,
          subscribersCount: channels[j].subscribersCount,
          videoCount: channels[j].videoCount,
          videos
        }
      }
      requiredData[categories[i].dataValues.name.split(".")[1]] = channels;
    }
    res.status(200).json({
      requiredData
    })
  }
  catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured in fetching categories!",
    });
  }
}