const express = require("express");
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
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`project has been started at port no ${PORT}`);
});
