const categories = require("../models/categories");
const users = require("../models/users");
const channels = require("../models/channels");
const videos = require("../models/videos");
const connect = require("../models/connect");
const jwt = require("jsonwebtoken");

const { Op } = require("sequelize");

exports.Login = async (req, res, next) => {
  const { userName, password } = req.body;
  try {
    const user = await users.findOne({
      where: {
        [Op.or]: [{ email: userName }, { userName: userName }],
      },
    });
    if (!user) {
      res.status(401).json({
        message: "userName of email not Found!",
      });
    } else {
      if (password == user.password) {
        const token = jwt.sign(
          {
            userId: user.userId,
          },
          "Videoster"
        );
        res.status(200).json({
          message: "Successfully LoggedIn",
          userId: user.userId,
          userName: user.userName,
          token,
        });
      } else {
        res.status(401).json({
          message: "Wrong Credentials!",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured!",
    });
  }
};

exports.Register = async (req, res, next) => {
  const { userName, password, email } = req.body;
  try {
    const user = await users.create({
      userName,
      email,
      password,
    });
    await user.createCategory({
      name: user.dataValues.userId + ".General",
    });
    res.status(200).json({
      message: "Registration Successful",
    });
  } catch (arr) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured!",
    });
  }
};
