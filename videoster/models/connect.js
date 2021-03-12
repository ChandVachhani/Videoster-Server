const categories = require("./categories");
const users = require("./users");
const channels = require("./channels");
const videos = require("./videos");

// users-categories

users.hasMany(categories, {
  onDelete: "CASCADE",
  foreignKey: {
    name: "fk_userId",
  },
});

// categories-channels

categories.belongsToMany(channels, {
  through: "CategoryChannels",
});

channels.belongsToMany(categories, {
  through: "CategoryChannels",
});

// channels-videos

channels.hasMany(videos, {
  onDelete: "CASCADE",
  foreignKey: {
    name: "fk_channelId",
    allowNull: false,
  },
});
