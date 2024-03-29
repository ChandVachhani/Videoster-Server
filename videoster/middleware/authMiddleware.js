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