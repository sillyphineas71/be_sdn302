const Feedback = require("../model/Feedback");
const Order = require("../model/order.model");

// 🧩 Tạo feedback (sau khi mua hàng)
exports.createFeedback = async (req, res) => {
  try {
    const { orderId, foodId, rating, comment, userId } = req.body;
    const order = await Order.findById(orderId);
    if (!order || order.status !== "paid")
      return res.status(400).json({ message: "Order invalid or not paid" });

    const fb = await Feedback.create({ orderId, foodId, rating, comment, userId });
    res.status(201).json(fb);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🧩 Lấy tất cả feedback (admin)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const fbs = await Feedback.find()
      .populate("userId", "fullName email")
      .populate("foodId", "name")
      .populate("orderId", "code");
    res.json(fbs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🧩 Xóa feedback (admin)
exports.deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
