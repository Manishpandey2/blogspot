const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/dbConfig");
const { dbname, user, password, host, dialect, pool } = dbConfig;
const sequelize = new Sequelize(dbname, user, password, {
  host,
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

db.users = require("./userModel")(sequelize, DataTypes);
db.sequelize.sync({ force: false }).then(() => {
  console.log("Sycned done");
});

module.exports = db;
