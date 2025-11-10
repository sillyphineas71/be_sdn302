// src/controller/feedbackController.js
const Feedback = require("../model/Feedback");
const Order = require("../model/order.model");
const OrderDetail = require("../model/orderDetail.model");
const User = require('../model/user.model')
/**
 *  Tạo feedback cho món đã mua
 */
exports.createFeedback = async (req, res) => {
  try {
    const { orderId, foodId, rating, comment } = req.body;
    const userId = req.userId; // 🧠 lấy từ middleware isAuth

    if (!orderId || !foodId || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Kiểm tra đơn hàng thuộc về user
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res
        .status(403)
        .json({ message: "You can only review your own orders" });
    }

    // Kiểm tra món ăn nằm trong đơn hàng đó
    const hasFood = await OrderDetail.findOne({ orderId, foodId });
    if (!hasFood) {
      return res
        .status(400)
        .json({ message: "This food does not belong to your order" });
    }

    // Kiểm tra xem đã feedback món này chưa
    const existing = await Feedback.findOne({ orderId, foodId, userId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already submitted feedback for this item" });
    }

    // Tạo feedback mới
    const fb = await Feedback.create({
      orderId,
      foodId,
      rating,
      comment,
      userId,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: fb,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 *  Lấy tất cả feedback (admin/public)
 */
exports.getAllFeedbacks = async (req, res) => {
  try {
    const fbs = await Feedback.find()
      .populate("userId", "email")
      .populate("foodId", "name")
      .populate("orderId", "code")
      .sort({ createdAt: -1 });

    res.json(fbs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 *  Xoá feedback (admin)
 */
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑️ Deleting feedback ID:", id);

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      console.log("⚠️ Feedback not found in DB!");
      return res.status(404).json({ message: "Feedback not found" });
    }

    await Feedback.findByIdAndDelete(id);

    // Kiểm tra lại DB sau khi xóa
    const exists = await Feedback.findById(id);
    console.log("🔍 Exists after delete:", exists);

    return res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error(" deleteFeedback error:", err);
    return res.status(500).json({ message: err.message || "Delete failed" });
  }
};
