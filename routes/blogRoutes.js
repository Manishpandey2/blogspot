const {
  homePage,
  aboutPage,
  renderBlogs,
  renderCreateBlog,
  createBlog,
  renderSingleBlog,
  renderDelete,
  renderEditBlog,
  editBlog,
} = require("../controller/blogController");

const router = require("express").Router();

router.route("/").get(homePage);
router.route("/about").get(aboutPage);
router.route("/blogs").get(renderBlogs);
router.route("/createblog").get(renderCreateBlog).post(createBlog);
router.route("/singleblog/:id").get(renderSingleBlog);
router.route("/deleteblog/:id").get(renderDelete);
router.route("/editblog/:id").get(renderEditBlog).post(editBlog);

module.exports = router;
