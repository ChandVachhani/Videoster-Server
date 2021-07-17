const Sequelize = require("sequelize");

const sequelize = new Sequelize("Videoster", "root", "", {
  dialect: "mysql",
  host: "localhost",
});


module.exports = sequelize;
