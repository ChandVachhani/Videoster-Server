const jwt = require("jsonwebtoken");

const users = require("../models/users");

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
      req.user = user;
      next();
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
};
