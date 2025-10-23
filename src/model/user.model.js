const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  label: { 
    type: String,
  },
  recipientName: {
    type: String,
    required: [true, 'Tên người nhận là bắt buộc'],
  },
  recipientPhone: {
    type: String,
    required: [true, 'SĐT người nhận là bắt buộc'],
  },
  street: {
    type: String,
    required: [true, 'Số nhà, tên đường là bắt buộc'],
  },
  ward: {
    type: String,
    required: [true, 'Phường/Xã là bắt buộc'],
  },
  district: {
    type: String,
    required: [true, 'Quận/Huyện là bắt buộc'],
  },
  city: {
    type: String,
    required: [true, 'Tỉnh/Thành phố là bắt buộc'],
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { 
  _id: true 
});

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    passHash: { type: String, required: true },
    phone: { type: String },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    isDisabled: { type: Boolean, default: false },
    addresses: [AddressSchema], 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: "user",
  }
);

UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", UserSchema);