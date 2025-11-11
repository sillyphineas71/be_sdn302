const express = require("express");
const router = express.Router();
const ctrl = require("../controller/blogController");
const { isAuth, checkRole } = require("../middleware/auth");

// Admin/staff blog management
router.get("/", isAuth, checkRole(["admin", "staff"]), ctrl.getAllBlogs);
router.post("/", isAuth, checkRole(["admin", "staff"]), ctrl.createBlog);
router.put("/:id", isAuth, checkRole(["admin", "staff"]), ctrl.updateBlog);
router.delete("/:id", isAuth, checkRole(["admin", "staff"]), ctrl.deleteBlog);

module.exports = router;
