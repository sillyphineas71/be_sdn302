const express = require("express");
const { getBlogs, getBlogBySlug } = require("../controller/blogController");

const router = express.Router();

router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);

module.exports = router;
