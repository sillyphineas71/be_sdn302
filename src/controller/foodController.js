//foodController.js
const Food = require("../model/food.model");
const Category = require("../model/category.model");

// GET /api/food/featured
const getFeaturedFoods = async (req, res) => {
  try {
    const { limit } = req.query;
    const take = Math.min(parseInt(limit || "8", 10), 50);

    const featured = await Food.find({
      inStock: true,
      $or: [{ tags: "featured" }, { tags: "popular" }],
    })
      .sort({ createdAt: -1 })
      .limit(take)
      .lean();

    return res.status(200).json({
      success: true,
      data: featured,
    });
  } catch (error) {
    console.error("Error getFeaturedFoods:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/food
const listFoods = async (req, res) => {
  try {
    const {
      page = "1",
      limit = "12",
      categoryId,
      search,
      inStock,
      sort, // price_asc | price_desc | newest
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10), 1);
    const pageSize = Math.min(Math.max(parseInt(limit, 10), 1), 100);

    const filters = {};
    if (categoryId) filters.categoryId = categoryId;
    if (typeof inStock !== "undefined") {
      filters.inStock = inStock === "true";
    }
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { tags: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 },
    };
    const sortOption = sortMap[sort] || { createdAt: -1 };

    const [items, total] = await Promise.all([
      Food.find(filters)
        .sort(sortOption)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Food.countDocuments(filters),
    ]);

    return res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error listFoods:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/food/:idOrSlug
const getFoodByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const query =
      idOrSlug.match(/^[0-9a-fA-F]{24}$/) != null
        ? { _id: idOrSlug }
        : { slug: idOrSlug };

    const item = await Food.findOne(query).lean();
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Error getFoodByIdOrSlug:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

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

module.exports = {
  getFeaturedFoods,
  listFoods,
  getFoodByIdOrSlug,
  updateFood,
  createFood,
};
