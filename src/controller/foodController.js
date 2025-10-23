const Food = require('../model/food.model.js'); 



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

module.exports = { updateFood };
