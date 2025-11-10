const express = require("express");
const router = express.Router();
const ctrl = require("../controller/blogController");

router.get("/", ctrl.getAllBlogs);
router.post("/", ctrl.createBlog);
router.put("/:id", ctrl.updateBlog);
router.delete("/:id", ctrl.deleteBlog);

module.exports = router;
