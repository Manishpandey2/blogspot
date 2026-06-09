const {
  renderRegister,
  userRegister,
  renderLogin,
  userLogin,
  renderadminDashboard,
  logout,
  getForgotPassword,
} = require("../controller/authController");

const router = require("express").Router();

router.route("/register").get(renderRegister).post(userRegister);
router.route("/login").get(renderLogin).post(userLogin);
router.route("/logout").get(logout);
router.route("/forgotPassword").get(getForgotPassword);

module.exports = router;
