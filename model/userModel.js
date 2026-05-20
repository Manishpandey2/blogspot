const userModel = (sequelize, DataTypes) => {
  const user = sequelize.define("user", {
    firstName: {
      type: DataTypes.STRING,
      allownull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allownull: false,
    },
    email: {
      type: DataTypes.STRING,
      allownull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allownull: false,
    },
  });
  return user;
};

module.exports = userModel;
