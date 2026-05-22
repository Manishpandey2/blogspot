const express = require("express");
require("dotenv").config();
const { users, blogs } = require("./model/index");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");

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
app.get("/blogs", (req, res) => {
  res.render("blogs");
});

app.get("/createblog", (req, res) => {
  res.render("createblog");
});

app.post("/createblog", async (req, res) => {
  try {
    const { title, subtitle, description, image } = req.body;
    if (!title || !subtitle || !description || !image) {
      return res.status(400).json({
        message: "All the fields are required",
      });
    }
    const blog = await blogs.create({
      title,
      subtitle,
      description,
      image,
    });

    return res.status(201).json({
      message: "Blog published",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
});
app.get("/register", (req, res) => {
  res.render("auth/register");
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
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`project has been started at port no ${PORT}`);
});
