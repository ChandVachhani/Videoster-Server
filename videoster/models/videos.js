const sequelize = require("../utils/database");
const Sequelize = require("sequelize");

const videos = sequelize.define("videos", {
  videoId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  description: {
    type: Sequelize.STRING(500),
    // allowNull: false
  },
  avatarDefault: {
    type: Sequelize.STRING,
    allowNull: false
  },
  avatarHigh: {
    type: Sequelize.STRING,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
})

module.exports = videos;