const router = require("express").Router();
const orderController = require("../controller/orderController");

router.post("/add", orderController.addOrder);

module.exports = router;
