const { blogs } = require("../model");

exports.adminController = async (req, res) => {
  const userId = req.user.id;

  const data = await blogs.findAll({
    where: {
      userId: userId,
    },
  });
  res.render("admindashboard", { blog: data });
};
