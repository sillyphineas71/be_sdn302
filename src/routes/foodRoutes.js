// foodRoutes.js
const express = require("express");
const router = express.Router();
const foodController = require("../controller/foodController");

// Thêm món ăn mới
router.post("/add", foodController.createFood);

// Cập nhật món ăn theo id
router.put("/:id", foodController.updateFood);

module.exports = router;
