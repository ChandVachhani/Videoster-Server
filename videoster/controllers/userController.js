const categories = require("../models/categories");
const users = require("../models/users");
const channels = require("../models/channels");
const videos = require("../models/videos");

exports.getCategories = async (req, res, next) => {
  try {
    let requiredCategories = await req.user.getCategories();
    requiredCategories = requiredCategories.map((cat) => {
      return cat.dataValues.name.split(".")[1];
    });
    res.status(200).json({
      categories: requiredCategories,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured in fetching categories!",
    });
  }
};

exports.addCategory = async (req, res, next) => {
  try {
    const givenCategory = req.user.userId + "." + req.body.category;
    const x = await req.user.createCategory({
      name: givenCategory,
    });
    res.status(200).json({
      message: "Category Successfully added!",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured in adding category!",
    });
  }
};
