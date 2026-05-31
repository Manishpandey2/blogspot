const { adminController } = require("../controller/adminController");
const { isAuthenticated } = require("../middleware/isAuthenticated");

const router = require("express").Router();

router.route("/admindashboard").get(isAuthenticated, adminController);

module.exports = router;
