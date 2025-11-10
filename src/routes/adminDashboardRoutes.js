const express = require("express");
const router = express.Router();
const adminDashboardController = require("../controller/adminDashboardController");

// Thống kê dashboard
router.get("/summary", adminDashboardController.getDashboardSummary);

module.exports = router;
