const sequelize = require("../utils/database");
const Sequelize = require("sequelize");

const channels = sequelize.define("channels", {
  channelId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
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
  viewsCount: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  subscribersCount: {
    type: Sequelize.INTEGER,
    // allowNull: false
  },
  videoCount: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
})

module.exports = channels;