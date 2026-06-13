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
    const error = req.flash("error");
    const success = req.flash("success");
    res.render("blogs", { blogs: allBlogs, error, success });
  } catch (error) {
    console.log(error);
    // res.status(500).json({ message: "Error loading BLog" });
    req.flash("error", "Error Loading BLog");
    res.redirect("/renderBlogs");
  }
};

exports.renderCreateBlog = (req, res) => {
  const error = req.flash("error");
  const success = req.flash("success");
  res.render("createblog", { error, success });
};

exports.renderSingleBlog = async (req, res) => {
  const id = req.params.id;
  const error = req.flash("error");
  const success = req.flash("success");
  const blog = await blogs.findByPk(id, {
    include: {
      model: users,
    },
  });
  if (!blog) {
    req.flash("error", "Blog not found");
    return res.redirect("/blogs");
  }
  res.render("singleblog", { blog, error, success });
};

exports.createBlog = async (req, res) => {
  try {
    const { id } = req.user;
    const { title, subtitle, description, image } = req.body;
    const photo = req.file;
    if (!title || !subtitle || !description || !photo) {
      // return res.status(400).json({
      //   message: "All the fields are required",
      // });
      req.flash("error", "All Fields Are Required");
      return res.redirect("/createblog");
    }
    const blog = await blogs.create({
      title,
      subtitle,
      description,
      image: process.env.IMG_URL + photo.filename,
      userId: id,
    });
    req.flash("success", "BLog published");
    return res.redirect("/blogs");
    // res.status(201).json({
    //   message: "Blog published",
    // });
  } catch (error) {
    console.log(error);
    // return res.status(500).json({
    //   message: "Server error",
    // });
    req.flash("error", "Server Error");
    return res.redirect("/createblog");
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
        // console.log("Error while deleting file", err);
        req.flash("error", "Error While deleting file");
        return res.redirect("/admindashboard");
      } else {
        console.log("File Deleting Successfully");
      }
    });
    await blogs.destroy({
      where: {
        id: id,
      },
    });
    req.flash("success", "Blog Deleted Successfully");
    return res.redirect("/admindashboard");
  } catch (error) {
    console.log(error);
    // return res.status(500).send({
    //   message: "Error deleting blog",
    // });
    req.flash("error", "Server Error");
    return res.redirect("/admindashboard");
  }
};

exports.renderEditBlog = async (req, res) => {
  const id = req.params.id;
  const error = req.flash("error");
  const success = req.flash("success");
  const blog = await blogs.findByPk(id);

  res.render("editblog", { blog: blog, error, success });
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
    req.flash("success", "Blog updated");
    return res.redirect("/admindashboard");
  } catch (error) {
    console.log(error);
    return res.status(500).send("error in update");
  }
};
