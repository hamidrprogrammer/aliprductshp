const orderModel = require("../models/orders");

class Order {
  async getAllOrders(req, res) {
    try {
      let Orders = await orderModel
        .find({})
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });
      if (Orders) {
        return res.json({ Orders });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getOrderByUser(req, res) {
    const uIdFromToken = req.userDetails._id; // Use ID from JWT
    // let { uId } = req.body; // uId from body is no longer primary source

    if (!uIdFromToken) {
      // Should be caught by loginCheck, but as a safeguard
      return res.status(401).json({ error: "User not authenticated." });
    }

    try {
      let Order = await orderModel
        .find({ user: uIdFromToken }) // Query by user ID from token
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email") // This might be redundant if only fetching for this user
        .sort({ _id: -1 });
      if (Order) {
        return res.json({ Order }); // Order can be an empty array if no orders found
      } else {
        // This case might not be hit if find() returns [] for no matches
        return res.status(404).json({ error: "No orders found for this user." });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Server error fetching orders." });
    }
  }

  async postCreateOrder(req, res) {
    // User ID will come from JWT token (req.userDetails._id)
    const userFromToken = req.userDetails._id;
    let { allProduct, amount, transactionId, address, phone } = req.body;

    if (
      !allProduct ||
      !userFromToken || // Ensure user is identified from token
      !amount ||
      !transactionId ||
      !address ||
      !phone
    ) {
      return res.status(400).json({ error: "All fields must be required and user authenticated." });
    }

    try {
      let newOrder = new orderModel({
        allProduct,
        user: userFromToken, // Use user ID from token
        amount,
        transactionId,
        address,
          phone,
        });
        let save = await newOrder.save();
        if (save) {
          return res.json({ success: "Order created successfully" });
        }
      } catch (err) {
        return res.json({ error: error });
      }
    }
  }

  async postUpdateOrder(req, res) {
    let { oId, status } = req.body;
    if (!oId || !status) {
      return res.json({ message: "All filled must be required" });
    } else {
      let currentOrder = orderModel.findByIdAndUpdate(oId, {
        status: status,
        updatedAt: Date.now(),
      });
      currentOrder.exec((err, result) => {
        if (err) console.log(err);
        return res.json({ success: "Order updated successfully" });
      });
    }
  }

  async postDeleteOrder(req, res) {
    let { oId } = req.body;
    if (!oId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deleteOrder = await orderModel.findByIdAndDelete(oId);
        if (deleteOrder) {
          return res.json({ success: "Order deleted successfully" });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}

const ordersController = new Order();
module.exports = ordersController;
