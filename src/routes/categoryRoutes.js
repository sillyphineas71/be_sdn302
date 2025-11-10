const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");

// GET /api/category - Lấy danh sách tất cả danh mục
router.get("/", categoryController.listCategories);

module.exports = router;