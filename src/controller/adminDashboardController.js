const Order = require("../model/order.model");
const OrderDetail = require("../model/orderDetail.model");
const mongoose = require("mongoose");

// GET /admin/dashboard/summary
const getDashboardSummary = async (req, res) => {
  try {
    // 1️⃣ Tổng doanh thu và số lượng đơn hàng theo ngày
    const revenueByDay = await Order.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalRevenue: { $sum: "$amounts.grandTotal" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2️⃣ Top sản phẩm bán chạy
    const topProducts = await OrderDetail.aggregate([
      {
        $group: {
          _id: "$foodId",
          name: { $first: "$name" },
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$lineTotal" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
    ]);

    // 3️⃣ Tổng sản phẩm bán ra
    const totalProductsSold = await OrderDetail.aggregate([
      { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } },
    ]);

    // 4️⃣ Thống kê trạng thái đơn hàng
    const orderStatusSummary = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$amounts.grandTotal" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        revenueByDay,
        topProducts,
        totalProductsSold: totalProductsSold[0]?.totalQuantity || 0,
        orderStatusSummary,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getDashboardSummary,
};
