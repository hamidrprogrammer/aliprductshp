const userModel = require("../models/users");
const bcrypt = require("bcryptjs");

class User {
  async getAllUser(req, res) {
    try {
      let Users = await userModel
        .find({})
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });
      if (Users) {
        return res.json({ Users });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getSingleUser(req, res) {
    const uIdFromToken = req.userDetails._id; // Use ID from JWT
    // const { uId: uIdFromBody } = req.body; // If frontend still sends it

    // Optional: Validate if uIdFromBody is provided and matches token.
    // if (uIdFromBody && uIdFromBody !== uIdFromToken.toString()) {
    //   return res.status(403).json({ error: "Forbidden to access another user's data." });
    // }

    if (!uIdFromToken) {
      return res.status(400).json({ error: "User ID not found in token." });
    }

    try {
      let User = await userModel
        .findById(uIdFromToken)
        .select("name email phoneNumber userImage updatedAt createdAt");
      if (User) {
        return res.json({ User });
      } else {
        return res.status(404).json({ error: "User not found." });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Server error while fetching user." });
    }
  }

  // Removed postAddUser method - it was misplaced order creation logic
  // async postAddUser(req, res) { ... }

  async postEditUser(req, res) {
    const uIdFromToken = req.userDetails._id;
    const { name, phoneNumber } = req.body; // uId from body is no longer needed for identifying user

    if (!name || !phoneNumber) { // uId is from token now
      return res.status(400).json({ error: "Name and phone number are required." });
    }

    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        uIdFromToken,
        {
          name: name,
          phoneNumber: phoneNumber,
          // updatedAt is handled by timestamps: true in schema
        },
        { new: true } // Return the updated document
      ).select("name email phoneNumber userImage updatedAt createdAt");

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found for update." });
      }
      return res.json({ success: "User updated successfully", user: updatedUser });
    } catch (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ error: "Server error while updating user." });
    }
  }

  // Removed getDeleteUser method - it was misplaced order status update logic
  // async getDeleteUser(req, res) { ... }

  async changePassword(req, res) {
    const uIdFromToken = req.userDetails._id;
    const { oldPassword, newPassword } = req.body; // uId from body is no longer needed

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Old password and new password are required." });
    }

    try {
      const user = await userModel.findById(uIdFromToken);
      if (!user) {
        // This should ideally not happen if loginCheck is effective
        return res.status(404).json({ error: "User not found." });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect old password." });
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      await userModel.findByIdAndUpdate(uIdFromToken, { password: hashedPassword });

      return res.json({ success: "Password updated successfully." });

    } catch (err) {
      console.error("Error changing password:", err);
      return res.status(500).json({ error: "Server error while changing password." });
    }
  }
}

const ordersController = new User();
module.exports = ordersController;
