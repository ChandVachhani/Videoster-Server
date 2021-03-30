const sequelize = require("../utils/database");
const Sequelize = require("sequelize");

const videos = sequelize.define("videos", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  videoId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  // avatarDefault: {
  //   type: Sequelize.STRING,
  //   allowNull: false,
  // },
  // avatarHigh: {
  //   type: Sequelize.STRING,
  //   allowNull: false,
  // },
  avatarMedium: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  views: {
    type: Sequelize.STRING(100),
  },
  publishedAt: {
    type: Sequelize.STRING(100),
  },
});

module.exports = videos;
