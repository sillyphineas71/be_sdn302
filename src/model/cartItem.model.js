const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema(
  {
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
    name: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    lineTotal: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "cartItem" }
);

module.exports = mongoose.model("CartItem", CartItemSchema);
