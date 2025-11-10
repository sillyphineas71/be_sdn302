// src/routes/feedbackRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controller/feedbackController");
const { isAuth,isAdmin  } = require("../middleware/auth"); // 🛡️ Middleware xác thực

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Customer feedback management
 */

/**
 * @swagger
 * /api/feedbacks:
 *   post:
 *     summary: Gửi phản hồi cho món ăn đã đặt
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - foodId
 *               - rating
 *             properties:
 *               orderId:
 *                 type: string
 *               foodId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *       400:
 *         description: Invalid input or already reviewed
 *       401:
 *         description: Unauthorized (no or invalid token)
 */
router.post("/", isAuth, ctrl.createFeedback); // 🧩 chỉ người login mới được gửi

/**
 * @swagger
 * /api/feedbacks:
 *   get:
 *     summary: Lấy toàn bộ feedback (admin hoặc public)
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: Danh sách feedback
 */
router.get("/", ctrl.getAllFeedbacks);

/**
 * @swagger
 * /api/feedbacks/{id}:
 *   delete:
 *     summary: Xóa phản hồi theo ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Feedback not found
 */
//  chỉ admin mới được xóa feedback
router.delete("/:id", isAuth, isAdmin, ctrl.deleteFeedback);

module.exports = router;
