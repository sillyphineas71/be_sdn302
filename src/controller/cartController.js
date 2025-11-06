const mongoose = require("mongoose");
const Cart = require("../model/cart.model");
const CartItem = require("../model/cartItem.model");
const Food = require("../model/food.model");
const Order = require("../model/order.model");
const OrderDetail = require("../model/orderDetail.model");
const Payment = require("../model/payment.model");
const PaymentMethod = require("../model/paymentMethod.model");

function genOrderCode() {
  const d = new Date();
  const pad = (n, w = 2) => `${n}`.padStart(w, "0");
  return `ORD-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(
    d.getDate()
  )}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

// GET /api/cart
// Get user's cart (authenticated)
module.exports.getCart = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);
    let cart = await Cart.findOne({ userId, status: "active" });
    if (!cart) {
      return res.status(200).json({
        message: "No active cart",
        cart: null,
        items: [],
        total: 0,
      });
    }
    console.log(cart);
    const items = await CartItem.find({ cartId: cart._id }).populate(
      "foodId",
      "name price salePrice image"
    );

    const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

    return res.status(200).json({
      message: "Cart retrieved",
      cart: {
        id: cart._id,
        userId: cart.userId,
        status: cart.status,
        createdAt: cart.createdAt,
      },
      items: items.map((item) => ({
        id: item._id,
        foodId: item.foodId._id,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
        food: item.foodId,
      })),
      total,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to get cart" });
  }
};

// POST /api/cart/items
// Add item to cart (authenticated)
// Body: { foodId, quantity }
module.exports.addItem = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { foodId, quantity } = req.body;

    if (!foodId) {
      return res.status(400).json({ message: "foodId is required" });
    }

    const qty = Number(quantity) || 1;
    if (qty <= 0) {
      return res.status(400).json({ message: "quantity must be positive" });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    let cart = await Cart.findOne({ userId, status: "active" });
    if (!cart) {
      cart = await Cart.create({ userId, status: "active" });
    }

    const existingItem = await CartItem.findOne({ cartId: cart._id, foodId });
    const unitPrice = food.salePrice != null ? food.salePrice : food.price;

    if (existingItem) {
      existingItem.quantity += qty;
      existingItem.lineTotal = existingItem.quantity * unitPrice;
      existingItem.updatedAt = new Date();
      await existingItem.save();

      return res.status(200).json({
        message: "Cart item quantity updated",
        item: {
          id: existingItem._id,
          foodId: existingItem.foodId,
          name: existingItem.name,
          unitPrice: existingItem.unitPrice,
          quantity: existingItem.quantity,
          lineTotal: existingItem.lineTotal,
        },
      });
    }

    const newItem = await CartItem.create({
      cartId: cart._id,
      foodId: food._id,
      name: food.name,
      unitPrice,
      quantity: qty,
      lineTotal: unitPrice * qty,
    });

    return res.status(201).json({
      message: "Item added to cart",
      item: {
        id: newItem._id,
        foodId: newItem.foodId,
        name: newItem.name,
        unitPrice: newItem.unitPrice,
        quantity: newItem.quantity,
        lineTotal: newItem.lineTotal,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to add item to cart" });
  }
};

// PUT /api/cart/items/:itemId
// Update cart item quantity
// Body: { quantity }
module.exports.updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "itemId is required" });
    }

    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      return res
        .status(400)
        .json({ message: "quantity must be a positive number" });
    }

    const item = await CartItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    item.quantity = qty;
    item.lineTotal = item.unitPrice * qty;
    item.updatedAt = new Date();
    await item.save();

    return res.status(200).json({
      message: "Cart item updated",
      item: {
        id: item._id,
        foodId: item.foodId,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to update cart item" });
  }
};

// DELETE /api/cart/items/:itemId
// Remove item from cart
module.exports.removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({ message: "itemId is required" });
    }

    const item = await CartItem.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.status(200).json({
      message: "Cart item removed",
      itemId: item._id,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to remove cart item" });
  }
};

// DELETE /api/cart
// Clear all items from user's cart (authenticated)
module.exports.clearCart = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    const cart = await Cart.findOne({ userId, status: "active" });
    if (!cart) {
      return res.status(404).json({ message: "No active cart found" });
    }

    const result = await CartItem.deleteMany({ cartId: cart._id });

    return res.status(200).json({
      message: "Cart cleared",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to clear cart" });
  }
};

// POST /api/cart/checkout
// Checkout cart - create order from cart items and remove them (authenticated)
// Body: { cartItemIds?, shipping?, discount?, tax?, notes?, paymentMethodCode? }
module.exports.checkout = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { cartItemIds, shipping, discount, tax, notes, paymentMethodCode } =
      req.body || {};

    // 1️⃣ Tìm giỏ hàng đang hoạt động
    const cart = await Cart.findOne({ userId, status: "active" });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "No active cart found for this user" });
    }

    // 2️⃣ Lấy danh sách item trong cart
    const cartItemQuery = { cartId: cart._id };
    if (Array.isArray(cartItemIds) && cartItemIds.length > 0) {
      cartItemQuery._id = {
        $in: cartItemIds.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }

    const cartItems = await CartItem.find(cartItemQuery);
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "No cart items to checkout" });
    }

    // 3️⃣ Tính toán tổng tiền
    let subtotal = 0;
    const orderDetails = [];
    for (const item of cartItems) {
      subtotal += item.lineTotal;
      orderDetails.push({
        foodId: item.foodId,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      });
    }

    const amounts = {
      currency: "VND",
      subtotal,
      shipping: Number.isFinite(shipping) ? Number(shipping) : 15000,
      discount: Number.isFinite(discount) ? Number(discount) : 0,
      tax: Number.isFinite(tax) ? Number(tax) : 0,
    };
    amounts.grandTotal =
      amounts.subtotal + amounts.shipping - amounts.discount + amounts.tax;

    // 4️⃣ Tạo đơn hàng
    const order = await Order.create({
      code: genOrderCode(),
      userId,
      status: "pending",
      amounts,
      notes: notes || undefined,
    });

    // 5️⃣ Tạo chi tiết đơn hàng
    await OrderDetail.insertMany(
      orderDetails.map((d) => ({ ...d, orderId: order._id }))
    );

    // 6️⃣ Xử lý thanh toán (nếu có)
    let payment = null;
    if (paymentMethodCode) {
      const pm = await PaymentMethod.findOne({
        code: paymentMethodCode.toUpperCase(),
      });

      if (!pm) {
        return res.status(400).json({ message: "Invalid payment method" });
      }

      payment = await Payment.create({
        orderId: order._id,
        methodId: pm._id,
        methodSnapshot: { code: pm.code, name: pm.name },
        amount: amounts.grandTotal,
        currency: amounts.currency,
        status: "pending",
      });

      await Order.updateOne(
        { _id: order._id },
        { $set: { paymentId: payment._id } }
      );
    }

    // 7️⃣ Xóa cart items sau khi checkout
    await CartItem.deleteMany({ _id: { $in: cartItems.map((i) => i._id) } });

    // 8️⃣ Cập nhật trạng thái giỏ hàng
    const remainingItems = await CartItem.countDocuments({ cartId: cart._id });
    if (remainingItems === 0) {
      await Cart.updateOne(
        { _id: cart._id },
        { $set: { status: "converted", updatedAt: new Date() } }
      );
    }

    // ✅ Hoàn tất
    return res.status(201).json({
      message: "Order created from cart",
      order: {
        id: order._id,
        code: order.code,
        status: order.status,
        amounts,
        items: orderDetails.length,
        paymentId: payment?._id || null,
      },
      cartItemsProcessed: cartItems.length,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Checkout failed" });
  }
};
