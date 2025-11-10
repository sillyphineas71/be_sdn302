const express = require("express");
const router = express.Router();
const cate = require('../controller/categoryController.js');

router.get('/', cate.getCategories);

module.exports = router;
