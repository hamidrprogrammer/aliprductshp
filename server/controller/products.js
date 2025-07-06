const productModel = require("../models/products");
const fs = require("fs");
const path = require("path");

class Product {
  // Delete Image from uploads -> products folder
  static deleteImages(images, mode) {
    var basePath =
      path.resolve(__dirname + "../../") + "/public/uploads/products/";
    console.log(basePath);
    for (var i = 0; i < images.length; i++) {
      let filePath = "";
      if (mode == "file") {
        filePath = basePath + `${images[i].filename}`;
      } else {
        filePath = basePath + `${images[i]}`;
      }
      console.log(filePath);
      if (fs.existsSync(filePath)) {
        console.log("Exists image");
      }
      fs.unlink(filePath, (err) => {
        if (err) {
          return err;
        }
      });
    }
  }

  async getAllProduct(req, res) {
    try {
      let Products = await productModel
        .find({})
        .populate("pCategory", "_id cName")
        .sort({ _id: -1 });
      if (Products) {
        return res.json({ Products });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async postAddProduct(req, res) {
    let { pName, pDescription, pPrice, pQuantity, pCategory, pOffer, pStatus, pIsFeatured } =
      req.body;
    let images = req.files;
    // Validation
    if (
      !pName || // Corrected logical OR
      !pDescription ||
      !pPrice ||
      !pQuantity ||
      !pCategory ||
      // pOffer can be 0, so check if it's undefined or null if it's truly optional, or ensure it's sent
    // For now, let's assume pOffer is required as per original logic.
    // If pOffer can be 0, !pOffer would be true. Check if it's undefined or handle appropriately.
    // For simplicity, if pOffer is sent as a string, it will be parsed. If missing and required, it fails.
      (pOffer === undefined || pOffer === null || pOffer === "") ||
      !pStatus
      // pIsFeatured has a default, so it's not strictly required in the body unless to set it true
    ) {
      Product.deleteImages(images, "file");
      return res.status(400).json({ error: "All fields (pName, pDescription, pPrice, pQuantity, pCategory, pOffer, pStatus) must be required. pIsFeatured defaults to false." });
    }
    // Validate Name and description
    else if (pName.length > 255 || pDescription.length > 3000) {
      Product.deleteImages(images, "file");
      return res.json({
        error: "Name 255 & Description must not be 3000 charecter long",
      });
    }
    // Validate Images
    else if (images.length !== 2) {
      Product.deleteImages(images, "file");
      return res.json({ error: "Must need to provide 2 images" });
    } else {
      try {
        let allImages = [];
        for (const img of images) {
          allImages.push(img.filename);
        }
        let newProduct = new productModel({
          pImages: allImages,
          pName,
          pDescription,
          pPrice: parseFloat(pPrice),
          pQuantity: parseInt(pQuantity, 10),
          pCategory,
          pOffer: parseFloat(pOffer), // Parse pOffer as a number
          pStatus,
          pIsFeatured: pIsFeatured === 'true' || pIsFeatured === true,
        });
        let save = await newProduct.save();
        if (save) {
          return res.json({ success: "Product created successfully" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postEditProduct(req, res) {
    let {
      pId,
      pName,
      pDescription,
      pPrice,
      pQuantity,
      pCategory,
      pOffer,
      pStatus,
      pIsFeatured, // Add pIsFeatured
      pImages,
    } = req.body;
    let editImages = req.files;

    // Validate other fileds
    if (
      !pId ||
      !pName ||
      !pDescription ||
      !pPrice ||
      !pQuantity ||
      !pCategory ||
      (pOffer === undefined || pOffer === null || pOffer === "") || // Validate pOffer correctly
      !pStatus
      // pIsFeatured has a default, so it's not strictly required
    ) {
       // If images were uploaded before validation fail, delete them
      if (editImages && editImages.length > 0) {
        Product.deleteImages(editImages, "file");
      }
      return res.status(400).json({ error: "All fields (pId, pName, pDescription, pPrice, pQuantity, pCategory, pOffer, pStatus) must be required. pIsFeatured defaults to false." });
    }
    // Validate Name and description
    else if (pName.length > 255 || pDescription.length > 3000) {
      return res.json({
        error: "Name 255 & Description must not be 3000 charecter long",
      });
    }
    // Validate Update Images
    else if (editImages && editImages.length == 1) {
      Product.deleteImages(editImages, "file");
      return res.json({ error: "Must need to provide 2 images" });
    } else {
      let editData = {
        pName,
        pDescription,
        pPrice: parseFloat(pPrice),
        pQuantity: parseInt(pQuantity, 10),
        pCategory,
        pOffer: parseFloat(pOffer), // Parse pOffer as a number
        pStatus,
        pIsFeatured: pIsFeatured === 'true' || pIsFeatured === true,
      };
      if (editImages.length == 2) {
        let allEditImages = [];
        for (const img of editImages) {
          allEditImages.push(img.filename);
        }
        editData = { ...editData, pImages: allEditImages };
        Product.deleteImages(pImages.split(","), "string");
      }
      try {
        let editProduct = productModel.findByIdAndUpdate(pId, editData);
        editProduct.exec((err) => {
          if (err) console.log(err);
          return res.json({ success: "Product edit successfully" });
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getDeleteProduct(req, res) {
    let { pId } = req.body;
    if (!pId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deleteProductObj = await productModel.findById(pId);
        let deleteProduct = await productModel.findByIdAndDelete(pId);
        if (deleteProduct) {
          // Delete Image from uploads -> products folder
          Product.deleteImages(deleteProductObj.pImages, "string");
          return res.json({ success: "Product deleted successfully" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getSingleProduct(req, res) {
    let { pId } = req.body;
    if (!pId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let singleProduct = await productModel
          .findById(pId)
          .populate("pCategory", "cName")
          .populate("pRatingsReviews.user", "name email userImage");
        if (singleProduct) {
          return res.json({ Product: singleProduct });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getProductByCategory(req, res) {
    let { catId } = req.body;
    if (!catId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let products = await productModel
          .find({ pCategory: catId })
          .populate("pCategory", "cName");
        if (products) {
          return res.json({ Products: products });
        }
      } catch (err) {
        return res.json({ error: "Search product wrong" });
      }
    }
  }

  async getProductByPrice(req, res) {
    let { price } = req.body;
    if (!price) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let products = await productModel
          .find({ pPrice: { $lt: price } })
          .populate("pCategory", "cName")
          .sort({ pPrice: -1 });
        if (products) {
          return res.json({ Products: products });
        }
      } catch (err) {
        return res.json({ error: "Filter product wrong" });
      }
    }
  }

  async getWishProduct(req, res) {
    let { productArray } = req.body;
    if (!productArray) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let wishProducts = await productModel.find({
          _id: { $in: productArray },
        });
        if (wishProducts) {
          return res.json({ Products: wishProducts });
        }
      } catch (err) {
        return res.json({ error: "Filter product wrong" });
      }
    }
  }

  async getCartProduct(req, res) {
    let { productArray } = req.body;
    if (!productArray) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let cartProducts = await productModel.find({
          _id: { $in: productArray },
        });
        if (cartProducts) {
          return res.json({ Products: cartProducts });
        }
      } catch (err) {
        return res.json({ error: "Cart product wrong" });
      }
    }
  }

  async postAddReview(req, res) {
    const { pId, rating, review } = req.body;
    const uId = req.userDetails._id; // Get uId from JWT

    if (!pId || !rating || !review) {
      return res.json({ error: "Product ID, rating, and review text are required." });
    }

    try {
      const product = await productModel.findById(pId);
      if (!product) {
        return res.json({ error: "Product not found." });
      }

      // Check if this user has already reviewed this product
      const existingReview = product.pRatingsReviews.find(
        (r) => r.user && r.user.toString() === uId.toString()
      );

      if (existingReview) {
        return res.json({ error: "You have already reviewed this product." });
      }

      // Add the new review
      product.pRatingsReviews.push({
        review: review,
        user: uId,
        rating: rating,
        // createdAt is defaulted by schema
      });

      await product.save();
      // Refetch product to populate user details in reviews for the response (optional, but good for consistency)
      const updatedProduct = await productModel.findById(pId).populate("pRatingsReviews.user", "name email");
      return res.json({ success: "Thanks for your review", product: updatedProduct });

    } catch (err) {
      console.error("Error adding review:", err);
      return res.status(500).json({ error: "Failed to add review." });
    }
  }

  async deleteReview(req, res) {
    const { rId, pId } = req.body; // reviewId and productId
    const loggedInUserId = req.userDetails._id;
    const loggedInUserRole = req.userDetails.role; // Assuming role is part of userDetails

    if (!rId || !pId) {
      return res.status(400).json({ error: "Review ID and Product ID are required." });
    }

    try {
      const product = await productModel.findById(pId);
      if (!product) {
        return res.status(404).json({ error: "Product not found." });
      }

      const reviewIndex = product.pRatingsReviews.findIndex(
        (r) => r._id.toString() === rId.toString()
      );

      if (reviewIndex === -1) {
        return res.status(404).json({ error: "Review not found." });
      }

      const reviewToDelete = product.pRatingsReviews[reviewIndex];

      // Check if the logged-in user is the author of the review OR if the user is an admin
      if (
        (reviewToDelete.user && reviewToDelete.user.toString() === loggedInUserId.toString()) ||
        loggedInUserRole === 1 // Assuming role 1 is Admin
      ) {
        product.pRatingsReviews.splice(reviewIndex, 1);
        await product.save();
        // Optionally, refetch product to send updated reviews back
        const updatedProduct = await productModel.findById(pId).populate("pRatingsReviews.user", "name email");
        return res.json({ success: "Review deleted successfully.", product: updatedProduct });
      } else {
        return res.status(403).json({ error: "You are not authorized to delete this review." });
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      return res.status(500).json({ error: "Failed to delete review." });
    }
  }

  async getFeaturedProducts(req, res) {
    try {
      let featuredProducts = await productModel
        .find({ pIsFeatured: true, pStatus: "Active" })
        .populate("pCategory", "_id cName")
        .sort({ _id: -1 }) // Or sort by some other criteria like pSold
        .limit(10); // Limit the number of featured products

      if (featuredProducts) {
        return res.json({ Products: featuredProducts });
      } else {
        return res.json({ Products: [] });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to fetch featured products" });
    }
  }
}

const productController = new Product();
module.exports = productController;
