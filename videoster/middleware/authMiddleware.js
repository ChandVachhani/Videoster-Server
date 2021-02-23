const jwt = require("jsonwebtoken");

const users = require("../models/users");

exports.verifyLogin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const payload = jwt.verify(token, "Videoster");
    if (payload) {
      const { userId } = payload;
      req.user = await users.findOne({
        where: {
          userId
        }
      });
      next();
    }
    else {
      res.status(401).json({
        message: "Not Authorized!"
      });
    }
  }
  catch (err) {
    res.status(401).json({
      message: "Can not decode token!"
    });
  }
}