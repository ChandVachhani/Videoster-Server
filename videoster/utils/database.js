const Sequelize = require("sequelize");

const sequelize = new Sequelize("Videoster", "root", "chand", {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;