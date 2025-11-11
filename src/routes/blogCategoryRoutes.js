const express = require("express");
const BlogCate = require("../controller/blogCategoryController");
const router = express.Router();

router.get("/", BlogCate.getBlogCategories);

module.exports = router;
