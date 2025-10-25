const mongoose = require("mongoose");

const AmountsSchema = new mongoose.Schema(
  {
    currency: { type: String, default: "VND" },
    subtotal: Number,
    shipping: Number,
    discount: Number,
    tax: Number,
    grandTotal: Number,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "pending" },
    amounts: AmountsSchema,
    notes: { type: String },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "order" }
);

module.exports = mongoose.model("Order", OrderSchema);
