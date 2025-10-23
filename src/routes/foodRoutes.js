//foodRoutes.js
const express = require('express');
const router = express.Router();
const { updateFood } = require('../controller/foodController.js');

router.put('/:id', updateFood);

module.exports = router;
