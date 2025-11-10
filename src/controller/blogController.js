const Blog = require("../model/blog.model");

// GET /api/blog
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .populate("blogCategoryId", "name slug")
      .populate("authorId", "name email")
      .sort({ publishedAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách blog", error: error.message });
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
    res.status(500).json({ message: "Lỗi khi lấy chi tiết blog", error: error.message });
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug
};
