const sequelize = require("../utils/database");
const Sequelize = require("sequelize");

const categories = sequelize.define("categories", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = categories;
