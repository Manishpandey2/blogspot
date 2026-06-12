const { user } = require("../config/dbConfig");
const { blogs, users } = require("../model");
const fs = require("fs");
exports.homePage = (req, res) => {
  const error = req.flash("error");
  const success = req.flash("success");
  res.render("home", { error, success });
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
  const blog = await blogs.findByPk(id, {
    include: {
      model: users,
    },
  });

  res.render("singleblog", { blog });
};

exports.createBlog = async (req, res) => {
  try {
    const { id } = req.user;
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
      image: process.env.IMG_URL + photo.filename,
      userId: id,
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
    const oldata = await blogs.findByPk(id);
    const oldPath = oldata.image;
    const oldPathLength = process.env.IMG_URL.length;
    const fileNameInStorage = oldPath.slice(oldPathLength);
    fs.unlink("storage/" + fileNameInStorage, (err) => {
      if (err) {
        console.log("Error while deleting file", err);
      } else {
        console.log("File Deleting Successfully");
      }
    });
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

    const olddata = await blogs.findByPk(id);
    let fileName;
    const updateData = { title, subtitle, description };
    if (req.file) {
      const oldPath = olddata.image;
      const lengthofUnWanted = "http://localhost:3000/".length;
      const fileNameInStorageFolder = oldPath.slice(lengthofUnWanted);
      fs.unlink("storage/" + fileNameInStorageFolder, (err) => {
        if (err) {
          console.log("Error while deleting file from server", err);
        } else {
          console.log("File Deleted Successfully");
        }
      });
      updateData.image = process.env.IMG_URL + req.file.filename;
    } else {
      updateData.image = olddata.image;
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
