const Order = require("../model/order.model");
const OrderDetail = require("../model/orderDetail.model");
const Payment = require("../model/payment.model");
const User = require("../model/user.model");

// GET /admin/orders
const listOrderDetails = async (req, res) => {
  try {
    const details = await OrderDetail.find();
    res.json({ success: true, data: details });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const listOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "fullName email phone") // chỉ lấy thông tin cần thiết
      .populate("paymentId", "status methodSnapshot amount currency paidAt")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /admin/orders/:orderId
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("userId", "fullName email phone")
      .populate("paymentId", "status methodSnapshot amount currency paidAt");

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const orderDetails = await OrderDetail.find({ orderId: order._id }).select(
      "name unitPrice quantity lineTotal"
    );

    res.json({
      success: true,
      data: {
        order,
        orderDetails,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /admin/orders/:orderId/status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("userId", "fullName email phone");

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /admin/orders/:orderId
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Xóa luôn order details liên quan
    await OrderDetail.deleteMany({ orderId: order._id });
    await Payment.deleteOne({ orderId: order._id });

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  listOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  listOrderDetails
};
