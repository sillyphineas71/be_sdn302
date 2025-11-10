const mongoose = require("mongoose");
const Order = require("../model/order.model");
const OrderDetail = require("../model/orderDetail.model");
const Food = require("../model/food.model");
const Payment = require("../model/payment.model");
const PaymentMethod = require("../model/paymentMethod.model");

function genOrderCode() {
  const d = new Date();
  const pad = (n, w = 2) => `${n}`.padStart(w, "0");
  return `ORD-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(
    d.getDate()
  )}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

// POST /api/order/add
// Create order directly from food items (legacy, bypass cart)
// Body: { userId, items: [{ foodId, quantity }], shipping?, discount?, tax?, notes?, paymentMethodCode? }
module.exports.addOrder = async (req, res) => {
  try {
    const { userId, items, shipping, discount, tax, notes, paymentMethodCode } =
      req.body || {};

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "items must be a non-empty array" });
    }

    const qtyMap = new Map();
    for (const it of items) {
      const id = String(it.foodId);
      const q = Number(it.quantity || 1);
      if (!mongoose.Types.ObjectId.isValid(id) || q <= 0) continue;
      qtyMap.set(id, (qtyMap.get(id) || 0) + q);
    }
    const foodIds = [...qtyMap.keys()].map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    if (foodIds.length === 0) {
      return res.status(400).json({ message: "No valid items" });
    }

    const foods = await Food.find({ _id: { $in: foodIds } });
    if (foods.length !== foodIds.length) {
      return res.status(400).json({ message: "Some food items not found" });
    }

    const details = [];
    let subtotal = 0;
    for (const food of foods) {
      const q = qtyMap.get(String(food._id));
      const unitPrice = food.salePrice != null ? food.salePrice : food.price;
      const lineTotal = unitPrice * q;
      subtotal += lineTotal;
      details.push({
        foodId: food._id,
        name: food.name,
        unitPrice,
        quantity: q,
        lineTotal,
      });
    }

    const amounts = {
      currency: "VND",
      subtotal,
      shipping: Number.isFinite(shipping) ? Number(shipping) : 15000,
      discount: Number.isFinite(discount) ? Number(discount) : 0,
      tax: Number.isFinite(tax) ? Number(tax) : 0,
    };
    const grandTotal =
      amounts.subtotal + amounts.shipping - amounts.discount + amounts.tax;
    amounts.grandTotal = grandTotal;

    const order = await Order.create({
      code: genOrderCode(),
      userId,
      status: "pending",
      amounts,
      notes: notes || undefined,
    });

    await OrderDetail.insertMany(
      details.map((d) => ({ ...d, orderId: order._id }))
    );

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
        amount: grandTotal,
        currency: amounts.currency,
        status: "pending",
      });
      await Order.updateOne(
        { _id: order._id },
        { $set: { paymentId: payment._id } }
      );
    }

    return res.status(201).json({
      message: "Order created",
      order: {
        id: order._id,
        code: order.code,
        status: order.status,
        amounts,
        items: details.length,
        paymentId: payment?._id || null,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to create order" });
  }
};

// GET /api/order/:orderId
// Get order details
module.exports.getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderDetails = await OrderDetail.find({
      orderId: order._id,
    }).populate("foodId", "name price salePrice image");

    let payment = null;
    if (order.paymentId) {
      payment = await Payment.findById(order.paymentId).populate(
        "methodId",
        "code name"
      );
    }

    return res.status(200).json({
      message: "Order retrieved",
      order: {
        id: order._id,
        code: order.code,
        userId: order.userId,
        status: order.status,
        amounts: order.amounts,
        notes: order.notes,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      items: orderDetails.map((item) => ({
        id: item._id,
        foodId: item.foodId._id,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
        food: item.foodId,
      })),
      payment: payment
        ? {
            id: payment._id,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            method: payment.methodSnapshot,
          }
        : null,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to get order" });
  }
};

// GET /api/order/my-orders
// Get all orders for authenticated user
module.exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const itemCount = await OrderDetail.countDocuments({
          orderId: order._id,
        });
        return {
          id: order._id,
          code: order.code,
          status: order.status,
          amounts: order.amounts,
          itemCount,
          createdAt: order.createdAt,
        };
      })
    );

    return res.status(200).json({
      message: "Orders retrieved",
      orders: ordersWithDetails,
      total: ordersWithDetails.length,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to get orders" });
  }
};

// PUT /api/order/:orderId/status
// Update order status
// Body: { status }
module.exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }
    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "shipping",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Order status updated",
      order: {
        id: order._id,
        code: order.code,
        status: order.status,
        updatedAt: order.updatedAt,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to update order status" });
  }
};
