const express = require("express");
const router = express.Router();
const foodController = require("../controller/foodController");
const { isAuth, isAdmin } = require("../middleware/auth");

// List with pagination, filters, sorting
router.get("/", foodController.listFoods);

// Featured must be defined before dynamic params
router.get("/featured", foodController.getFeaturedFoods);

// Unified detail by id or slug
router.get("/:idOrSlug", foodController.getFoodByIdOrSlug);

// Admin create/update/delete (when mounted under /api/admin/foods)
router.post("/add", isAuth, isAdmin, foodController.createFood);
router.put("/:id/update", isAuth, isAdmin, foodController.updateFood);
router.delete("/:id", isAuth, isAdmin, foodController.deleteFood);

module.exports = router;
