const router = require("express").Router();
const foodController = require("../controller/foodController");

router.post("/add", foodController.createFood);

module.exports = router;