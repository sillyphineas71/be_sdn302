//userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../model/user.model');
const { addAddress,updateAddress } = require('../controller/userController');
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('_id fullName email phone roleId')
      .populate('roleId', 'name'); // nếu có bảng Role
    res.json(users);
  } catch (error) {
    console.error(' Lỗi khi lấy danh sách user:', error);
    res.status(500).json({ message: 'Không thể tải danh sách người dùng' });
  }
});
router.patch('/:userId/addresses', addAddress);
router.put('/:userId/addresses/:addressId', updateAddress);
module.exports = router;