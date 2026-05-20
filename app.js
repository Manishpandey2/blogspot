const express = require("express");
require("dotenv").config();
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

app.post("/createblog", (req, res) => {
  console.log(req.body);
  res.json({ message: "data submitted" });
});
app.get("/register", (req, res) => {
  res.render("auth/register");
});

app.get("/login", (req, res) => {
  res.render("auth/login");
});
app.post("/register", (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;
    if (!firstName || !lastName || !userName || !email || !password) {
      return res.status(200).json({
        message: "All the fields are requried",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "unable to create user",
    });
  }
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`project has been started at port no ${PORT}`);
});
