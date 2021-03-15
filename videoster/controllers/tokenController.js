const categories = require("../models/categories");
const users = require("../models/users");
const channels = require("../models/channels");
const videos = require("../models/videos");

exports.getData = async (req, res, next) => {
  try {
    console.log(req.params.token);
    res.status(200).json({
      tokenData: {},
      message: "Category Successfully added!",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured in fetching tokens!",
    });
  }
};
