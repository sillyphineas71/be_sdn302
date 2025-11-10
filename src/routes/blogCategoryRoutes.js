const express = require("express");
const router = express.Router();
const BlogCategory = require("../model/blogCategory.model");

// Lấy toàn bộ danh mục blog
router.get("/", async (req, res) => {
  try {
    const categories = await BlogCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
