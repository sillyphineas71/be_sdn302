const router = require("express").Router();
const orderController = require("../controller/orderController");
const { isAuth } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order management
 */

// Lấy danh sách đơn hàng theo userId (dành cho admin hoặc public API)
router.get("/user/:userId", orderController.getOrdersByUser);

/**
 * @swagger
 * /api/order/add:
 *   post:
 *     summary: Create order directly (legacy, bypass cart)
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - items
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     foodId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *               shipping:
 *                 type: number
 *                 default: 15000
 *               discount:
 *                 type: number
 *                 default: 0
 *               tax:
 *                 type: number
 *                 default: 0
 *               notes:
 *                 type: string
 *               paymentMethodCode:
 *                 type: string
 *                 description: Payment method code (e.g., COD, VNPAY)
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     code:
 *                       type: string
 *                     status:
 *                       type: string
 *                     amounts:
 *                       $ref: '#/components/schemas/Amounts'
 *                     items:
 *                       type: integer
 *                     paymentId:
 *                       type: string
 *                       nullable: true
 *       400:
 *         description: Bad request or invalid items
 *       404:
 *         description: Some food items not found
 */
router.post("/add", isAuth, orderController.addOrder);

/**
 * @swagger
 * /api/order/{orderId}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderDetail'
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Order not found
 */
router.get("/:orderId", orderController.getOrder);

/**
 * @swagger
 * /api/order/my-orders:
 *   get:
 *     summary: Get all orders for authenticated user
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       code:
 *                         type: string
 *                       status:
 *                         type: string
 *                       amounts:
 *                         $ref: '#/components/schemas/Amounts'
 *                       itemCount:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get("/my-orders", isAuth, orderController.getUserOrders);

/**
 * @swagger
 * /api/order/{orderId}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, shipping, delivered, cancelled]
 *                 description: New order status
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     code:
 *                       type: string
 *                     status:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Order not found
 */
router.put("/:orderId/status", orderController.updateOrderStatus);

module.exports = router;
