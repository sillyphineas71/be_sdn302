const mongoose = require("mongoose");

const BlogCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "blog_category" }
);

module.exports = mongoose.model("BlogCategory", BlogCategorySchema);
