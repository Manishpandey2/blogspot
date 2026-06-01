const jwt = require("jsonwebtoken");

const { promisify } = require("util");
const { users } = require("../model");

exports.isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  const decryptedResult = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRETKEY,
  );

  const userExist = await users.findOne({
    where: {
      id: decryptedResult.id,
    },
  });
  if (!userExist) {
    res.send("User with that token doesn't exist");
  } else {
    req.user = userExist;
    next();
  }
};
