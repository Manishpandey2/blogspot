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
  verifyOtp,
  getChangePassword,
} = require("../controller/authController");

const router = require("express").Router();

router.route("/register").get(renderRegister).post(userRegister);
router.route("/login").get(renderLogin).post(userLogin);
router.route("/logout").get(logout);
router.route("/forgotPassword").get(getForgotPassword).post(postForgotPassword);
router.route("/verifyOtp").get(getverifyOtp);
router.route("/verifyOtp/:id").post(verifyOtp);
router.route("/changePassword").get(getChangePassword);

module.exports = router;
