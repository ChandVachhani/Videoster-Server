const sequelize = require("../utils/database");
const Sequelize = require("sequelize");

const channels = sequelize.define("channels", {
  channelId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING(2500),
    // allowNull: false
  },
  avatarDefault: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  avatarHigh: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  viewsCount: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  subscribersCount: {
    type: Sequelize.STRING(100),
    // allowNull: false
  },
  videoCount: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
});

module.exports = channels;
