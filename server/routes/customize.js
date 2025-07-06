const express = require("express");
const router = express.Router();
const customizeController = require("../controller/customize");
const multer = require("multer");
const { loginCheck, isAdmin } = require("../middleware/auth");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/customize");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/get-slide-image", customizeController.getImages); // Publicly accessible for shop slider
router.post("/delete-slide-image", loginCheck, isAdmin, customizeController.deleteSlideImage);
router.post(
  "/upload-slide-image",
  loginCheck,
  isAdmin,
  upload.single("image"),
  customizeController.uploadSlideImage
);
router.post("/dashboard-data", loginCheck, isAdmin, customizeController.getAllData);

module.exports = router;
