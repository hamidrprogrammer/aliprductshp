const { toTitleCase } = require("../config/function");
const categoryModel = require("../models/categories");
const fs = require("fs");

class Category {
  async getAllCategory(req, res) {
    try {
      let Categories = await categoryModel.find({}).sort({ _id: -1 });
      if (Categories) {
        return res.json({ Categories });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async postAddCategory(req, res) {
    let { cName, cDescription, cStatus } = req.body;
    let cImage = req.file.filename;
    const filePath = `../server/public/uploads/categories/${cImage}`;

    if (!cName || !cDescription || !cStatus || !cImage) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
        return res.json({ error: "All filled must be required" });
      });
    } else {
      cName = toTitleCase(cName);
      try {
        let checkCategoryExists = await categoryModel.findOne({ cName: cName });
        if (checkCategoryExists) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(err);
            }
            return res.json({ error: "Category already exists" });
          });
        } else {
          let newCategory = new categoryModel({
            cName,
            cDescription,
            cStatus,
            cImage,
          });
          await newCategory.save((err) => {
            if (!err) {
              return res.json({ success: "Category created successfully" });
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postEditCategory(req, res) {
    const { cId, cName, cDescription, cStatus } = req.body;
    const cImage = req.file ? req.file.filename : null; // Check if new image is uploaded

    if (!cId) {
      // If a new image was uploaded but cId is missing, delete the uploaded image
      if (cImage) {
        const filePath = `../server/public/uploads/categories/${cImage}`;
        fs.unlink(filePath, (err) => { if (err) console.log("Error deleting uploaded file during validation fail:", err); });
      }
      return res.status(400).json({ error: "Category ID is required." });
    }

    try {
      const categoryToUpdate = await categoryModel.findById(cId);
      if (!categoryToUpdate) {
        if (cImage) {
          const filePath = `../server/public/uploads/categories/${cImage}`;
          fs.unlink(filePath, (err) => { if (err) console.log("Error deleting uploaded file for non-existent category:", err); });
        }
        return res.status(404).json({ error: "Category not found." });
      }

      const updateData = { updatedAt: Date.now() };
      if (cName) updateData.cName = toTitleCase(cName);
      if (cDescription) updateData.cDescription = cDescription;
      if (cStatus) updateData.cStatus = cStatus;

      let oldImagePath = null;
      if (cImage) {
        oldImagePath = `../server/public/uploads/categories/${categoryToUpdate.cImage}`;
        updateData.cImage = cImage;
      }

      const updatedCategory = await categoryModel.findByIdAndUpdate(cId, updateData, { new: true });

      if (updatedCategory) {
        // If update was successful and a new image was uploaded, delete the old image
        if (cImage && oldImagePath && categoryToUpdate.cImage !== cImage) { // Ensure old image exists and is different
          fs.unlink(oldImagePath, (err) => {
            if (err) console.log("Error deleting old category image:", err);
          });
        }
        return res.json({ success: "Category updated successfully", category: updatedCategory });
      } else {
        // Should not happen if findById found the category, but as a safeguard
        if (cImage) { // If update failed but image was uploaded
            const filePath = `../server/public/uploads/categories/${cImage}`;
            fs.unlink(filePath, (err) => { if (err) console.log("Error deleting uploaded file on update failure:", err); });
        }
        return res.status(500).json({ error: "Failed to update category." });
      }
    } catch (err) {
      console.log(err);
      // If any DB error occurs and an image was uploaded, try to delete it.
      if (cImage) {
        const filePath = `../server/public/uploads/categories/${cImage}`;
        fs.unlink(filePath, (errFs) => { if (errFs) console.log("Error deleting uploaded file during catch:", errFs); });
      }
      return res.status(500).json({ error: "Server error while updating category." });
    }
  }

  async getDeleteCategory(req, res) {
    let { cId } = req.body;
    if (!cId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deletedCategoryFile = await categoryModel.findById(cId);
        const filePath = `../server/public/uploads/categories/${deletedCategoryFile.cImage}`;

        let deleteCategory = await categoryModel.findByIdAndDelete(cId);
        if (deleteCategory) {
          // Delete Image from uploads -> categories folder 
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(err);
            }
            return res.json({ success: "Category deleted successfully" });
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}

const categoryController = new Category();
module.exports = categoryController;
