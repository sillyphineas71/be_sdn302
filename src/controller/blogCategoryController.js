const BlogCategory = require("../model/blogCategory.model");

// GET /api/blog-category
const getBlogCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh mục blog", error: error.message });
  }
};

module.exports = {
  getBlogCategories
};
