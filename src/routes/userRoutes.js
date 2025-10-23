//userRoutes.js
const express = require('express');
const router = express.Router();

const { addAddress,updateAddress } = require('../controller/userController');

router.patch('/:userId/addresses', addAddress);
router.put('/:userId/addresses/:addressId', updateAddress);
module.exports = router;