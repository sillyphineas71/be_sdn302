//userRoutes.js
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { getProfile, updateProfile, addAddress, updateAddress } = require('../controller/userController');

router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);

router.patch('/:userId/addresses', addAddress);
router.put('/:userId/addresses/:addressId', updateAddress);
module.exports = router;