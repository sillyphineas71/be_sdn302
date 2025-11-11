const express = require("express");
const router = express.Router();
const adminOrderController = require("../controller/adminOrderController");
const { isAuth, isAdmin } = require("../middleware/auth");

// Danh sách đơn hàng

router.get("/", isAuth, isAdmin, adminOrderController.listOrders);
router.get(
  "/orderdetails",
  isAuth,
  isAdmin,
  adminOrderController.listOrderDetails
);
// Chi tiết đơn hàng
router.get("/:orderId", isAuth, isAdmin, adminOrderController.getOrderById);

// Cập nhật trạng thái đơn hàng
router.put(
  "/:orderId/status",
  isAuth,
  isAdmin,
  adminOrderController.updateOrderStatus
);

// Xóa đơn hàng
router.delete("/:orderId", isAuth, isAdmin, adminOrderController.deleteOrder);

module.exports = router;
