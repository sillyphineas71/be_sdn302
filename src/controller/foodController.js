//foodController.js
const Food = require("../model/food.model");
const Category = require("../model/category.model");

const createFood = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      price,
      salePrice,
      currency,
      images,
      tags,
      inStock,
      description,
    } = req.body;

    // Validate required fields
    if (!name || !categoryId || !price) {
      return res.status(400).json({
        success: false,
        message: "Name, categoryId, and price are required",
      });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Create new food
    const newFood = new Food({
      name,
      slug,
      categoryId,
      price,
      salePrice: salePrice || null,
      currency: currency || "VND",
      images: images || [],
      tags: tags || [],
      inStock: inStock !== undefined ? inStock : true,
      description: description || "",
    });

    const savedFood = await newFood.save();

    res.status(201).json({
      success: true,
      message: "Food created successfully",
      data: savedFood,
    });
  } catch (error) {
    console.error("Error creating food:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateFood = async (req, res) => {
  try {
    const { id } = req.params;

    const existingFood = await Food.findById(id);
    if (!existingFood) {
      return res.status(404).json({ message: "Food not found" });
    }

    const {
      name,
      slug,
      categoryId,
      price,
      salePrice,
      currency,
      images,
      tags,
      inStock,
      description,
    } = req.body;

    if (!name || !slug || !categoryId || !price || !currency) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (price < 0 || (salePrice && salePrice < 0)) {
      return res.status(400).json({ message: "Price values must be >= 0" });
    }

    existingFood.name = name;
    existingFood.slug = slug;
    existingFood.categoryId = categoryId;
    existingFood.price = price;
    existingFood.salePrice = salePrice ?? null;
    existingFood.currency = currency;
    existingFood.images = images ?? [];
    existingFood.tags = tags ?? [];
    existingFood.inStock = inStock ?? true;
    existingFood.description = description ?? "";
    existingFood.updatedAt = new Date();

    const updatedFood = await existingFood.save();

    res.status(200).json({
      message: "Food updated successfully (full update)",
      data: updatedFood,
    });
  } catch (error) {
    console.error("Error updating food:", error);
    res.status(500).json({
      message: "Failed to update food",
      error: error.message,
    });
  }
};

const getFoods = async (req, res) => {
  try {
    // Lấy danh sách món còn hàng (inStock = true)
    const foods = await Food.find({ inStock: true }).populate('categoryId', 'name slug');
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách món ăn', error: error.message });
  }
};

module.exports = { updateFood, createFood ,getFoods };
