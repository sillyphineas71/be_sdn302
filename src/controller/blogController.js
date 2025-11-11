const Blog = require("../model/blog.model");

// Lấy tất cả bài blog (admin)
exports.getAllBlogs = async (req, res) => {
  const blogs = await Blog.find()
    .populate("authorId", "fullName")
    .populate("blogCategoryId", "name");
  res.json(blogs);
};

// Tạo mới
exports.createBlog = async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(201).json(blog);
};

// Cập nhật
exports.updateBlog = async (req, res) => {
  const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

// Xóa
exports.deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};
// GET /api/blog
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .populate("blogCategoryId", "name slug")
      .populate("authorId", "name email")
      .sort({ publishedAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách blog", error: error.message });
  }
};

// GET /api/blog/:slug
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true })
      .populate("blogCategoryId", "name slug")
      .populate("authorId", "name email");

    if (!blog) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy chi tiết blog", error: error.message });
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
};
