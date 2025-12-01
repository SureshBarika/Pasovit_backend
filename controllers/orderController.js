// backend/controllers/orderController.js
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendOrderEmail } = require('../utils/sendEmail');

/**
 * POST /api/orders
 * body: { shippingAddress: {...}, paymentMethod: 'mock', items: optional array to override cart }
 * If items provided in body, use them; otherwise use logged-in user's cart.
 */
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, items: itemsOverride } = req.body;

    // determine items
    let items = [];
    if (itemsOverride && Array.isArray(itemsOverride) && itemsOverride.length > 0) {
      items = itemsOverride.map(i => ({
        product: i.product,
        name: i.name,
        size: i.size,
        qty: Number(i.qty),
        price: Number(i.price)
      }));
    } else {
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (!cart || !cart.items.length) return res.status(400).json({ message: 'Cart is empty' });
      items = cart.items.map(it => ({
        product: it.product._id,
        name: it.name,
        size: it.size,
        qty: it.qty,
        price: it.price
      }));
    }

    // Optional: validate stock (simple overall stock check)
    for (const it of items) {
      const prod = await Product.findById(it.product);
      if (!prod) return res.status(400).json({ message: `Product not found: ${it.name}` });
      if (prod.stock < it.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${prod.name}` });
      }
    }

    // calculate total
    const totalPrice = items.reduce((s, it) => s + (it.price * it.qty), 0);

    const order = await Order.create({
      user: req.user._id,
      items,
      totalPrice,
      shippingAddress
    });

    // reduce stock (basic)
    for (const it of items) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.qty } });
    }

    // clear cart
    await Cart.findOneAndDelete({ user: req.user._id });

    // send email (non-blocking but await to catch errors)
    try {
      await sendOrderEmail(req.user.email, order);
    } catch (emailErr) {
      console.error('Email send failed', emailErr);
      // don't fail the order because of email error - return a warning
      return res.status(201).json({ order, emailSent: false, message: 'Order created but email sending failed' });
    }

    res.status(201).json({ order, emailSent: true });
  } catch (err) { next(err); }
};

const getOrdersForUser = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { next(err); }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // ensure owner
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } catch (err) { next(err); }
};

module.exports = { createOrder, getOrdersForUser, getOrderById };
