const express = require('express');
const orderController = require("../controller/adminUserController.js");


const router = express.Router();

router.get("/", orderController.listUsers);
router.put("/block/:id", orderController.blockUser);
router.put("/unblock/:id", orderController.unblockUser);
router.put("/edit/:id", orderController.editUser);

module.exports = router;
