const { user } = require("../config/dbConfig");
const { blogs } = require("../model");

exports.homePage = (req, res) => {
  res.render("home");
};

exports.aboutPage = (req, res) => {
  res.render("about");
};

exports.renderBlogs = async (req, res) => {
  try {
    const allBlogs = await blogs.findAll();

    res.render("blogs", { blogs: allBlogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error loading BLog" });
  }
};

exports.renderCreateBlog = (req, res) => {
  res.render("createblog");
};

exports.renderSingleBlog = async (req, res) => {
  const id = req.params.id;
  const blog = await blogs.findByPk(id);

  res.render("singleblog", { blog });
};

exports.createBlog = async (req, res) => {
  try {
    console.log(req.user);
    const { title, subtitle, description, image } = req.body;
    const photo = req.file;
    if (!title || !subtitle || !description || !photo) {
      return res.status(400).json({
        message: "All the fields are required",
      });
    }
    const blog = await blogs.create({
      title,
      subtitle,
      description,
      image: photo.filename,
    });
    return res.redirect("blogs");
    // res.status(201).json({
    //   message: "Blog published",
    // });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.renderDelete = async (req, res) => {
  try {
    const id = req.params.id;
    await blogs.destroy({
      where: {
        id: id,
      },
    });
    return res.redirect("/admindashboard");
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error deleting blog",
    });
  }
};

exports.renderEditBlog = async (req, res) => {
  const id = req.params.id;

  const blog = await blogs.findByPk(id);

  res.render("editblog", { blog: blog });
};

exports.editBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, subtitle, description } = req.body;
    const photo = req.file;

    const updateData = { title, subtitle, description };
    if (photo) {
      updateData.image = photo.filename;
    }

    const result = await blogs.update(updateData, {
      where: { id: id },
    });

    return res.redirect("/admindashboard");
  } catch (error) {
    console.log(error);
    return res.status(500).send("error in update");
  }
};
