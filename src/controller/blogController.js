const Blog = require("../model/blog.model");

// Lấy tất cả bài blog (admin)
exports.getAllBlogs = async (req, res) => {
  const blogs = await Blog.find().populate("authorId", "fullName").populate("blogCategoryId", "name");
  res.json(blogs);
};

// Tạo mới
exports.createBlog = async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(201).json(blog);
};

// Cập nhật
exports.updateBlog = async (req, res) => {
  const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// Xóa
exports.deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};
