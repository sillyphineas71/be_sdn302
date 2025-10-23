//foodController.js
const Food = require("../model/food.model");
const Category = require("../model/category.model");

const createFood = async (req, res) => {
    try {
        const { name, categoryId, price, salePrice, currency, images, tags, inStock, description } = req.body;
        
        // Validate required fields
        if (!name || !categoryId || !price) {
            return res.status(400).json({
                success: false,
                message: "Name, categoryId, and price are required"
            });
        }

        // Generate slug from name
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
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
            description: description || ""
        });

        const savedFood = await newFood.save();
        
        res.status(201).json({
            success: true,
            message: "Food created successfully",
            data: savedFood
        });
    } catch (error) {
        console.error("Error creating food:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    createFood
};