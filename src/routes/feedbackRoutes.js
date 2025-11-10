const express = require("express");
const router = express.Router();
const ctrl = require("../controller/feedbackController");

router.post("/", ctrl.createFeedback);
router.get("/", ctrl.getAllFeedbacks);
router.delete("/:id", ctrl.deleteFeedback);

module.exports = router;
