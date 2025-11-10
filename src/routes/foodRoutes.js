//foodRoutes.js
const express = require("express");
const router = express.Router();
const foodController = require("../controller/foodController");

router.get("/featured", foodController.getFeaturedFoods);
router.get("/", foodController.listFoods);
router.get("/:idOrSlug", foodController.getFoodByIdOrSlug);
router.post("/add", foodController.createFood);
router.put("/:id", foodController.updateFood);

module.exports = router;
