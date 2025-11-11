const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const Category = require("../model/category.model");

// ✅ Lấy tất cả danh mục
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
=======
const categoryController = require("../controller/categoryController");

// GET /api/category - Lấy danh sách tất cả danh mục
router.get("/", categoryController.listCategories);

module.exports = router;
>>>>>>> minhnq
