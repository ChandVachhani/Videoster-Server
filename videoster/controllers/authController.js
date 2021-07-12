const categories = require("../models/categories");
const users = require("../models/users");
const channels = require("../models/channels");
const videos = require("../models/videos");
const connect = require("../models/connect");
const jwt = require("jsonwebtoken");

const { Op } = require("sequelize");
const bcrype = require("bcrypt");

const UIDGenerator = require("uid-generator");
const uidgen = new UIDGenerator();

/////////////////////////// MAILGUN //////////////////////////////

const mailgun = require("mailgun-js");
const DOMAIN = "videoster.tech";
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: DOMAIN,
});

sendMail = function (reciever_email, email_subject, email_body) {
  const data = {
    from: "Videoster <developer@videoster.tech>",
    to: reciever_email,
    subject: email_subject,
    text: email_body,
  };

  mg.messages().send(data, (error, body) => {
    if (error) console.log(error);
    else console.log(body);
  });
};

//////////////////////////////////////////////////////////////////

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
        message: "userName or email not Found!",
      });
    } else {
      if (!user.dataValues.isVarified) {
        res.status(401).json({
          message: "Verify your email First",
        });
      }
      if (await bcrype.compare(password, user.password)) {
        console.log("++++", user);
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
    const hashedPassword = await bcrype.hash(password, 12);
    const token = (await uidgen.generate()).toString();
    console.log("token => ", token);
    const user = await users.create({
      userName,
      email,
      password: hashedPassword,
      token,
    });
    const tokenCategory = (await uidgen.generate()).toString();
    await user.createCategory({
      name: user.dataValues.userId + ".GENERAL",
      token: tokenCategory,
    });

    const content = `https://videoster.tech/varifyEmail/${user.dataValues.token}`;
    sendMail(email, "Varify Email", content);
    res.status(200).json({
      message: "Registration Successful. Check your mail!",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "userName or email already Exist",
    });
  }
};

exports.varifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await users.findOne({
      where: {
        token,
      },
    });
    if (!user) {
      res.status(401).json({
        message: "token is Invalid!",
      });
    }
    await user.update({
      isVarified: true,
    });
    res.status(200).json({
      message: "Check your mail!",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Email id or userName does not exist!",
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { userName } = req.body;
    const user = await users.findOne({
      where: {
        [Op.or]: [{ email: userName }, { userName: userName }],
      },
    });
    if (!user) {
      res.status(401).json({
        message: "userName of email not Found!",
      });
    }
    const email = user.dataValues.email;
    const content = `https://videoster.tech/changePassword/${user.dataValues.token}`;
    sendMail(email, "Change Password", content);
    res.status(200).json({
      message: "Check your mail!",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Email id or userName does not exist!",
    });
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { password, token } = req.body;
    const user = await users.findOne({
      where: {
        token,
      },
    });
    if (!user) {
      res.status(401).json({
        message: "token is Invalid!",
      });
    }
    const hashedPassword = await bcrype.hash(password, 12);
    await user.update({
      password: hashedPassword,
    });
    res.status(200).json({
      message: "password changed successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "some error in changing pass",
    });
  }
};

exports.verifyLogin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, "Videoster");
    console.log(token);
    if (payload) {
      const { userId } = payload;
      console.log(userId);
      const user = await users.findOne({
        where: {
          userId,
        },
      });
      if (!user) {
        res.status(401).json({
          message: "Not Authorized!",
        });
      }
      res.status(200).json({
        message: "User Varified!",
        user,
      });
    } else {
      res.status(401).json({
        message: "Not Authorized!",
      });
    }
  } catch (err) {
    res.status(401).json({
      message: "User is not verified!",
    });
  }
}