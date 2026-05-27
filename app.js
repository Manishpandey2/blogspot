const express = require("express");
require("dotenv").config();
const { users, blogs } = require("./model/index");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const { multer, storage } = require("./middleware/multerConfig");
const {
  homePage,
  aboutPage,
  renderBlogs,
  renderCreateBlog,
  renderSingleBlog,
  createBlog,
  renderDelete,
  renderEditBlog,
  editBlog,
} = require("./controller/blogController");
const {
  renderRegister,
  renderadminDashboard,
  renderLogin,
  userRegister,
  userLogin,
} = require("./controller/authController");
const upload = multer({ storage: storage });
require("./model/index");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public/css/"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", homePage);
app.get("/about", aboutPage);
app.get("/blogs", renderBlogs);

app.get("/createblog", renderCreateBlog);
app.get("/singleblog/:id", renderSingleBlog);
app.post("/createblog", upload.single("image"), createBlog);
app.get("/deleteblog/:id", renderDelete);

app.get("/admindashboard", renderadminDashboard);

app.get("/editblog/:id", renderEditBlog);
app.post("/editblog/:id", upload.single("image"), editBlog);

app.get("/register", renderRegister);
app.get("/login", renderLogin);
app.post("/register", userRegister);
app.post("/login", userLogin);
const PORT = 3000;
app.use(express.static("storage/"));
app.listen(PORT, () => {
  console.log(`project has been started at port no ${PORT}`);
});
