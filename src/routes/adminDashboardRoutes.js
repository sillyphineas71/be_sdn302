const express = require("express");
const router = express.Router();
const adminDashboardController = require("../controller/adminDashboardController");
const { isAuth, isAdmin } = require("../middleware/auth");

// Thống kê dashboard
router.get(
  "/summary",
  isAuth,
  isAdmin,
  adminDashboardController.getDashboardSummary
);

module.exports = router;
