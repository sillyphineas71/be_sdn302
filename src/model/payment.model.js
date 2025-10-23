const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    methodId: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod" },
    methodSnapshot: { type: Object },
    amount: { type: Number, required: true },
    currency: { type: String, default: "VND" },
    status: { type: String, default: "pending" },
    paidAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "payment" }
);

module.exports = mongoose.model("Payment", PaymentSchema);
