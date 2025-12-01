// backend/models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String },
  size: { type: String },
  qty: { type: Number },
  price: { type: Number }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Processing' },
  shippingAddress: {
    fullName: String,
    addressLine1: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
