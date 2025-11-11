const express = require("express");
const router = express.Router();
const foodController = require("../controller/foodController");

// ✅ Lấy danh sách tất cả món ăn (optional nếu FE cần)
router.get("/", async (req, res) => {
  try {
    const foods = await require("../model/food.model").find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Lấy 1 món ăn theo ID
router.get("/:id", foodController.getFoodById);

// ✅ Thêm món ăn mới
router.get("/featured", foodController.getFeaturedFoods);
router.get("/:idOrSlug", foodController.getFoodByIdOrSlug);
router.post("/add", foodController.createFood);

// ✅ Cập nhật món ăn
router.put("/:id/update", foodController.updateFood);

module.exports = router;
