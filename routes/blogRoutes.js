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
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { multer, storage } = require("../middleware/multerConfig");
const upload = multer({ storage: storage });
const router = require("express").Router();

router.route("/").get(homePage);
router.route("/about").get(aboutPage);
router.route("/blogs").get(renderBlogs);
router
  .route("/createblog")
  .get(renderCreateBlog)
  .post(isAuthenticated, upload.single("image"), createBlog);
router.route("/singleblog/:id").get(renderSingleBlog);
router.route("/deleteblog/:id").get(renderDelete);
router
  .route("/editblog/:id")
  .get(renderEditBlog)
  .post(upload.single("image"), editBlog);

module.exports = router;
