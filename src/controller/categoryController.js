const Category = require("../model/category.model");

// GET /api/category
const listCategories = async (req, res) => {
  try {
    // Lấy tất cả danh mục từ MongoDB
    const categories = await Category.find({}).sort({ name: 1 }).lean();

    // Trả về dữ liệu theo format { success: true, data: [...] }
    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error listing categories:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  listCategories,
};
