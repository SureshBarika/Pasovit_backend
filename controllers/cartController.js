// backend/controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Note: Guest cart stored in frontend localStorage.
 * Backend cart endpoints operate on logged-in user's cart.
 */

// GET /api/cart  (protected)
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) { next(err); }
};

// POST /api/cart/add { productId, size, qty }
const addToCart = async (req, res, next) => {
  try {
    const { productId, size, qty = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // find existing item (same product + size)
    const idx = cart.items.findIndex(it => it.product.toString() === productId && (it.size || '') === (size || ''));

    if (idx > -1) {
      // update qty
      cart.items[idx].qty += Number(qty);
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.image,
        size,
        qty: Number(qty),
        price: product.price
      });
    }

    await cart.save();
    const full = await Cart.findById(cart._id).populate('items.product');
    res.json(full);
  } catch (err) { next(err); }
};

// PUT /api/cart/update { productId, size, qty }
const updateCartItem = async (req, res, next) => {
  try {
    const { productId, size, qty } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const idx = cart.items.findIndex(it => it.product.toString() === productId && (it.size || '') === (size || ''));
    if (idx === -1) return res.status(404).json({ message: 'Item not in cart' });

    if (qty <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].qty = Number(qty);
    }

    await cart.save();
    const full = await Cart.findById(cart._id).populate('items.product');
    res.json(full);
  } catch (err) { next(err); }
};

// DELETE /api/cart/remove { productId, size }
const removeCartItem = async (req, res, next) => {
  try {
    const { productId, size } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const idx = cart.items.findIndex(it => it.product.toString() === productId && (it.size || '') === (size || ''));
    if (idx === -1) return res.status(404).json({ message: 'Item not in cart' });

    cart.items.splice(idx, 1);

    await cart.save();
    const full = await Cart.findById(cart._id).populate('items.product');
    res.json(full);
  } catch (err) { next(err); }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
