const express = require("express");
require("dotenv").config();

const bcrypt = require("bcrypt");

const { multer, storage } = require("./middleware/multerConfig");

require("./model/index");
const app = express();
const cookieParser = require("cookie-parser");
app.set("view engine", "ejs");
app.use(express.static("public/css/"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoute = require("./routes/authRoutes");
const blogRoute = require("./routes/blogRoutes");
const adminRoute = require("./routes/adminRoutes");
app.use(cookieParser());
app.use("", authRoute);
app.use("", blogRoute);
app.use("", adminRoute);

const PORT = 3000;
app.use(express.static("storage/"));
app.listen(PORT, () => {
  console.log(`project has been started at port no ${PORT}`);
});
