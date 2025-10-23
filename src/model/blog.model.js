const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    coverImage: { type: String },
    blogCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
    },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "blog" }
);

BlogSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Blog", BlogSchema);
