const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadedFileType = ["image/png", "image/jpg", "image/jpeg"];
    if (!uploadedFileType.includes(file.mimetype)) {
      cb(new Error("Invalid file types, Only supports png, jpg, jpeg file"));
      return;
    }

    cb(null, "./storage");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = {
  multer,
  storage,
};
