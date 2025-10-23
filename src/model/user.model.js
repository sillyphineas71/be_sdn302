const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    passHash: { type: String, required: true },
    phone: { type: String },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    isDisabled: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "user" }
);

module.exports = mongoose.model("User", UserSchema);
