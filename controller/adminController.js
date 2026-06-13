const { blogs } = require("../model");

exports.adminController = async (req, res) => {
  const userId = req.user.id;
  const error = req.flash("error");
  const success = req.flash("success");
  const data = await blogs.findAll({
    where: {
      userId: userId,
    },
  });
  res.render("admindashboard", { blog: data, error, success });
};
