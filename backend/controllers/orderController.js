import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order and initialize Razorpay checkout.
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address, userId } = req.body;

    if (
      !userId ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0 ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order details",
      });
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    // Save the order first so its database ID can be used as the receipt.
    const newOrder = new orderModel({
      userId,
      items,
      amount: Number(amount),
      address,
      payment: false,
    });

    await newOrder.save();

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: newOrder._id.toString(),
    });

    // Associate the Razorpay order with our database order.
    newOrder.razorpayOrderId = razorpayOrder.id;
    await newOrder.save();

    // IMPORTANT: Do not clear the cart here.
    // It will be cleared only after payment verification succeeds.

    return res.json({
      success: true,
      order: razorpayOrder,
      mongoOrderId: newOrder._id,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Place order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to initialize payment. Please try again.",
    });
  }
};

// Verify the Razorpay payment on the backend.
const verifyOrder = async (req, res) => {
  try {
    const {
      orderId,
      success,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Never trust a frontend success flag by itself.
    if (
      success !== "true" ||
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment was not completed or payment details are missing.",
      });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // The Razorpay order must match the order stored in our database.
    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Payment order does not match.",
      });
    }

    // Verify Razorpay's server-side order details.
    const razorpayOrder =
      await razorpayInstance.orders.fetch(razorpay_order_id);

    if (
      razorpayOrder.receipt !== order._id.toString() ||
      razorpayOrder.currency !== "INR" ||
      Number(razorpayOrder.amount) !==
        Math.round(Number(order.amount) * 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment amount or order details do not match.",
      });
    }

    // Verify the checkout signature using the Razorpay secret.
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      console.error("RAZORPAY_KEY_SECRET is not configured.");

      return res.status(500).json({
        success: false,
        message: "Payment verification is not configured.",
      });
    }

    const signaturePayload =
      `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signaturePayload)
      .digest("hex");

    const receivedBuffer = Buffer.from(razorpay_signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    const signatureIsValid =
      receivedBuffer.length === expectedBuffer.length &&
      receivedBuffer.length > 0 &&
      crypto.timingSafeEqual(receivedBuffer, expectedBuffer);

    if (!signatureIsValid) {
      // Keep the order for investigation; do not delete it.
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed.",
      });
    }

    // Idempotency: a repeated verification should not cause problems.
    if (order.payment) {
      return res.json({
        success: true,
        message: "Payment was already verified.",
      });
    }

    // Mark the order as paid only after signature verification succeeds.
    order.payment = true;
    await order.save();

    // Clear the user's server-side cart only after successful verification.
    await userModel.findByIdAndUpdate(order.userId, {
      cartData: {},
    });

    return res.json({
      success: true,
      message: "Payment verified successfully.",
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify payment right now.",
    });
  }
};

// Get orders belonging to the logged-in user.
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({
      userId: req.body.userId,
    });

    return res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("User orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
};

// List all orders for an admin.
const listOrders = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);

    if (!userData || userData.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    const orders = await orderModel.find({});

    return res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("List orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
};

// Update order status for an admin.
const updateStatus = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);

    if (!userData || userData.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });

    return res.json({
      success: true,
      message: "Order status updated.",
    });
  } catch (error) {
    console.error("Update status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update order status.",
    });
  }
};

export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
};
