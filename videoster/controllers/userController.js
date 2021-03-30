const categories = require("../models/categories");
const users = require("../models/users");
const channels = require("../models/channels");
const videos = require("../models/videos");

const UIDGenerator = require("uid-generator");
const uidgen = new UIDGenerator();

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
    const token = (await uidgen.generate()).toString();
    const x = await req.user.createCategory({
      name: givenCategory,
      token,
    });
    res.status(200).json({
      message: "Category Successfully added!",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Category name already exist!",
    });
  }
};

exports.getTokens = async (req, res, next) => {
  try {
    const result = await req.user.getCategories();
    let tokens = {};
    result.forEach((curr) => {
      tokens[curr.dataValues.name.split(".")[1]] = curr.dataValues.token;
    });
    tokens["GENERAL"] = req.user.token;
    res.status(200).json({
      tokens,
      message: "Category Successfully added!",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured in fetching tokens!",
    });
  }
};
