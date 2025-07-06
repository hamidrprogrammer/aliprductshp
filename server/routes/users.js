const express = require("express");
const router = express.Router();
const usersController = require("../controller/users");
const { loginCheck, isAdmin } = require("../middleware/auth");

router.get("/all-user", loginCheck, isAdmin, usersController.getAllUser); // Protected
router.post("/single-user", loginCheck, usersController.getSingleUser); // Protected
// router.post("/add-user", usersController.postAddUser); // Removed: Misplaced order creation logic
router.post("/edit-user", loginCheck, usersController.postEditUser); // Protected
// router.post("/delete-user", usersController.getDeleteUser); // Removed: Misplaced order status update logic

router.post("/change-password", loginCheck, usersController.changePassword); // Protected

module.exports = router;
