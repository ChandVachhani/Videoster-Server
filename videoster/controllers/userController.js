const categories = require("../models/categories");
const users = require("../models/users");

exports.addCategory = async (req, res, next) => {
  let { userId, category } = req.body;
  try {
    const user = await users.findOne({
      where: {
        userId
      }
    });
    category = userId + "." + category;
    const x = await user.createCategory({
      name: category
    });
    console.log("==>", x);
    res.status(200).json({
      message: "Category Successfully added!"
    })
  }
  catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Some Error Occured!"
    });
  }
}

// exports.addChannels = async (req, res, next) => {

// }