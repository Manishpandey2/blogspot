const { blogs } = require("../model");

exports.adminController = async (req, res) => {
  const data = await blogs.findAll();
  res.render("admindashboard", { blog: data });
};
