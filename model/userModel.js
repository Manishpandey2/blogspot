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
    userName: {
      type: DataTypes.STRING,
      allownull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allownull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allownull: true,
    },
    otpExpiry: {
      type: DataTypes.DATE,
      allownull: true,
    },
  });
  return user;
};

module.exports = userModel;
