const express = require("express");
const router = express.Router();
const productController = require("../controller/products");
const multer = require("multer");
const { loginCheck, isAdmin } = require("../middleware/auth");

router.get("/featured", productController.getFeaturedProducts); // New route for featured products

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/all-product", productController.getAllProduct);
router.post("/product-by-category", productController.getProductByCategory);
router.post("/product-by-price", productController.getProductByPrice);
router.post("/wish-product", productController.getWishProduct);
router.post("/cart-product", productController.getCartProduct);

router.post("/add-product", loginCheck, isAdmin, upload.any(), productController.postAddProduct);
router.post("/edit-product", loginCheck, isAdmin, upload.any(), productController.postEditProduct);
router.post("/delete-product", loginCheck, isAdmin, productController.getDeleteProduct);
router.post("/single-product", productController.getSingleProduct); // Publicly accessible

// Users can add reviews if logged in. Admins can delete any review, users can delete their own.
router.post("/add-review", loginCheck, productController.postAddReview);
router.post("/delete-review", loginCheck, productController.deleteReview); // Auth check further in controller

module.exports = router;
