const categories = require("../models/categories");
const users = require("../models/users");
const channels = require("../models/channels");
const videos = require("../models/videos");
const connect = require("../models/connect");

const { Op } = require("sequelize");

exports.Login = async (req, res, next) => {
  const { userName, password } = req.body;
  try {
    const user = await users.findOne({
      where: {
        [Op.or]: [{ email: userName }, { userName: userName }]
      }
    });
    if (!user) {
      res.status(401).json({
        message: "userName of email not Found!"
      })
    }
    else {
      if (password == user.password) {
        res.status(200).json({
          message: "Successfully LoggedIn",
          userid: user.userId,
          userName: user.userName
        });
      }
      else {
        res.status(401).json({
          message: "Wrong Credentials!"
        })
      }
    }
  }
  catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured!"
    })
  }
}

exports.Register = async (req, res, next) => {
  const { userName, password, email } = req.body;
  try {
    await users.create({
      userName,
      email,
      password
    });
    res.status(200).json({
      message: "Registration Successful"
    });
  }
  catch (arr) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured!"
    });
  }
}