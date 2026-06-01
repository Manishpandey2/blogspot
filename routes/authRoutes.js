const {
  renderRegister,
  userRegister,
  renderLogin,
  userLogin,
  renderadminDashboard,
  logout,
} = require("../controller/authController");

const router = require("express").Router();

router.route("/register").get(renderRegister).post(userRegister);
router.route("/login").get(renderLogin).post(userLogin);
router.route("/logout").get(logout);

module.exports = router;
