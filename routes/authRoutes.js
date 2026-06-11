const {
  renderRegister,
  userRegister,
  renderLogin,
  userLogin,
  renderadminDashboard,
  logout,
  getForgotPassword,
  postForgotPassword,
  getverifyOtp,
} = require("../controller/authController");

const router = require("express").Router();

router.route("/register").get(renderRegister).post(userRegister);
router.route("/login").get(renderLogin).post(userLogin);
router.route("/logout").get(logout);
router.route("/forgotPassword").get(getForgotPassword).post(postForgotPassword);
router.route("/verifyOtp").get(getverifyOtp);

module.exports = router;
