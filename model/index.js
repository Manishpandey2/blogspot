const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/dbConfig");
const blogModel = require("./blogModel");
const { dbname, user, password, host, port, dialect, pool } = dbConfig;
const sequelize = new Sequelize(dbname, user, password, {
  host,
  port,
  dialect,
  pool,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("unable to connect database", err);
  });

db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.blogs = blogModel(sequelize, DataTypes);
db.users = require("./userModel")(sequelize, DataTypes);
db.sequelize.sync({ force: false }).then(() => {
  console.log("Sycned done");
});

module.exports = db;
