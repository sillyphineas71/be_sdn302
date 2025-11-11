const router = require("express").Router();
const cartController = require("../controller/cartController");
const { isAuth } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management (requires authentication)
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart (authenticated)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
 *                 total:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", isAuth, cartController.getCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add item to cart (authenticated)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - foodId
 *             properties:
 *               foodId:
 *                 type: string
 *                 description: Food ID
 *               quantity:
 *                 type: integer
 *                 default: 1
 *                 description: Quantity to add
 *     responses:
 *       200:
 *         description: Item quantity updated (if already in cart)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 item:
 *                   $ref: '#/components/schemas/CartItem'
 *       201:
 *         description: Item added to cart
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Food not found
 */
router.post("/items", isAuth, cartController.addItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: New quantity
 *     responses:
 *       200:
 *         description: Cart item updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 item:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Invalid quantity
 *       404:
 *         description: Cart item not found
 */
router.put("/items/:itemId", isAuth, cartController.updateItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Cart item removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 itemId:
 *                   type: string
 *       404:
 *         description: Cart item not found
 */
router.delete("/items/:itemId", isAuth, cartController.removeItem);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear all items from cart (authenticated)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedCount:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No active cart found
 */
router.delete("/", isAuth, cartController.clearCart);

/**
 * @swagger
 * /api/cart/checkout:
 *   post:
 *     summary: Checkout cart (create order from cart items) - authenticated
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartItemIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Specific cart item IDs to checkout (optional, defaults to all)
 *               shipping:
 *                 type: number
 *                 default: 15000
 *                 description: Shipping fee
 *               discount:
 *                 type: number
 *                 default: 0
 *                 description: Discount amount
 *               tax:
 *                 type: number
 *                 default: 0
 *                 description: Tax amount
 *               notes:
 *                 type: string
 *                 description: Order notes
 *               paymentMethodCode:
 *                 type: string
 *                 description: Payment method code (e.g., COD, VNPAY)
 *     responses:
 *       201:
 *         description: Order created from cart
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
 *                 cartItemsProcessed:
 *                   type: integer
 *       400:
 *         description: Bad request or invalid payment method
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No active cart found
 */
router.post("/checkout", isAuth, cartController.checkout);

module.exports = router;
