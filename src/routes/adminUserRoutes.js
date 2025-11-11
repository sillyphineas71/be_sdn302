const express = require("express");
const orderController = require("../controller/adminUserController.js");
const { isAuth, isAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", isAuth, isAdmin, orderController.listUsers);
router.put("/block/:id", isAuth, isAdmin, orderController.blockUser);
router.put("/unblock/:id", isAuth, isAdmin, orderController.unblockUser);
router.put("/edit/:id", isAuth, isAdmin, orderController.editUser);

module.exports = router;
