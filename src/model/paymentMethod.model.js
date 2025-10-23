const mongoose = require("mongoose");

const PaymentMethodSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "payment_method" }
);

module.exports = mongoose.model("PaymentMethod", PaymentMethodSchema);
