const User = require("../model/user.model");
const Role = require("../model/role.model");

// 📋 Danh sách user (trừ role admin)
const listUsers = async (req, res) => {
  try {
    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) return res.status(404).json({ message: "Role 'admin' not found" });

    const users = await User.find({ roleId: { $ne: adminRole._id } })
      .populate("roleId", "name description")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🚫 Block user
const blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isDisabled: true }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User blocked", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Unblock user
const unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isDisabled: false }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User unblocked", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Edit user
const editUser = async (req, res) => {
  try {
    // Các field được phép cập nhật
    const allowedFields = ["fullName", "phone", "roleId", "isDisabled"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  listUsers,
  blockUser,
  unblockUser,
  editUser,
};
