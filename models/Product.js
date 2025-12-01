// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, index: true },
  sizes: [{ type: String }],
  stock: { 
    // stock per size (optional complexity) or overall stock
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
