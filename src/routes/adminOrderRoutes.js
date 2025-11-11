const express = require("express");
const router = express.Router();
const adminOrderController = require("../controller/adminOrderController");

// Danh sách đơn hàng

router.get("/", adminOrderController.listOrders);
router.get("/orderdetails", adminOrderController.listOrderDetails);
// Chi tiết đơn hàng
router.get("/:orderId", adminOrderController.getOrderById);

// Cập nhật trạng thái đơn hàng
router.put("/:orderId/status", adminOrderController.updateOrderStatus);

// Xóa đơn hàng
router.delete("/:orderId", adminOrderController.deleteOrder);

module.exports = router;
