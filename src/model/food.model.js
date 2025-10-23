const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: null },
    currency: { type: String, default: "VND" },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    inStock: { type: Boolean, default: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "food" }
);

// text index for name and tags (Mongoose won't create a text index automatically unless you create it in DB,
// but defining here documents intent)
FoodSchema.index({ name: "text", tags: "text" });

module.exports = mongoose.model("Food", FoodSchema);
