const User = require('../model/user.model.js');

// const getProfile = async (req, res) => {
//   try {
//     const { userId } = req.user || {};
//     if (!userId) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const user = await User.findById(userId).lean();
//     if (!user) {
//       return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
//     }

//     return res.status(200).json({
//       message: 'Lấy thông tin người dùng thành công!',
//       user: {
//         id: user._id,
//         email: user.email,
//         fullName: user.fullName,
//         phone: user.phone,
//         addresses: user.addresses || [],
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt,
//       }
//     });
//   } catch (error) {
//     console.error('Lỗi khi lấy thông tin người dùng:', error);
//     return res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
//   }
// };

// const updateProfile = async (req, res) => {
//   try {
//     const { userId } = req.user || {};
//     if (!userId) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const { fullName, phone } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
//     }

//     if (typeof fullName !== 'undefined') user.fullName = fullName;
//     if (typeof phone !== 'undefined') user.phone = phone;

//     const updated = await user.save();

//     return res.status(200).json({
//       message: 'Cập nhật hồ sơ thành công!',
//       user: {
//         id: updated._id,
//         email: updated.email,
//         fullName: updated.fullName,
//         phone: updated.phone,
//         addresses: updated.addresses || [],
//         createdAt: updated.createdAt,
//         updatedAt: updated.updatedAt,
//       }
//     });
//   } catch (error) {
//     console.error('Lỗi khi cập nhật hồ sơ:', error);
//     return res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
//   }
// };

const addAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const newAddressData = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    if (newAddressData.isDefault === true) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(newAddressData);

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'Thêm địa chỉ mới thành công!',
      user: updatedUser
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }

    console.error('Lỗi khi thêm địa chỉ:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};
const updateAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const updatedAddressData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    if (updatedAddressData.isDefault === true) {
      user.addresses.forEach(addr => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
    }

    const addressToUpdate = user.addresses.id(addressId);
    if (!addressToUpdate) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ.' });
    }

    Object.assign(addressToUpdate, updatedAddressData);

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'Cập nhật địa chỉ thành công!',
      user: updatedUser
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    console.error('Lỗi khi cập nhật địa chỉ:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};
//nam đây mà
module.exports = {
  // getProfile,
  // updateProfile,
  addAddress, updateAddress
};