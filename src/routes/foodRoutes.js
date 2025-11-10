//foodRoutes.js
const express = require("express");
const router = express.Router();
const foodController = require("../controller/foodController");

router.post("/add", foodController.createFood);
router.put("/:id",foodController.updateFood);

module.exports = router;
