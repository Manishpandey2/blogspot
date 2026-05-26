const express = require("express");
require("dotenv").config();
const { users, blogs } = require("./model/index");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const { multer, storage } = require("./middleware/multerConfig");
const upload = multer({ storage: storage });
require("./model/index");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public/css/"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/blogs", async (req, res) => {
  try {
    const allBlogs = await blogs.findAll();

    res.render("blogs", { blogs: allBlogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error loading BLog" });
  }
});

app.get("/createblog", (req, res) => {
  res.render("createblog");
});
app.get("/singleblog/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await blogs.findByPk(id);

  res.render("singleblog", { blog });
});
app.post("/createblog", upload.single("image"), async (req, res) => {
  try {
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
});
app.get("/deleteblog/:id", async (req, res) => {
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
});
app.get("/register", (req, res) => {
  res.render("auth/register");
});
app.get("/admindashboard", async (req, res) => {
  const blog = await blogs.findAll();
  res.render("admindashboard", { blog });
});
app.get("/login", (req, res) => {
  res.render("auth/login");
});
app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;
    if (!firstName || !lastName || !userName || !email || !password) {
      return res.status(200).json({
        message: "All the fields are requried",
      });
    }
    const existingUser = await users.findOne({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        message: "user already registered with this eamil address",
      });
    }
    const newUser = await users.create({
      firstName,
      lastName,
      userName,
      email,
      password: bcrypt.hashSync(password, 10),
    });
    res.status(200).json({
      message: "user created ",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "unable to create user",
    });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "both fields are required",
      });
    }
    const user = await users.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "user not found with this email",
      });
    }
    const isMatched = bcrypt.compareSync(password, user.password);
    if (!isMatched) {
      return res.status(401).json({
        message: "wrong password",
      });
    }
    return res.status(200).json({
      message: "User Logged in",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server error",
    });
  }
});
app.get("/editblog/:id", async (req, res) => {
  const id = req.params.id;

  const blog = await blogs.findByPk(id);

  res.render("editblog", { blog: blog });
});
app.post("/editblog/:id", upload.single("image"), async (req, res) => {
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
});
const PORT = 3000;
app.use(express.static("storage/"));
app.listen(PORT, () => {
  console.log(`project has been started at port no ${PORT}`);
});
