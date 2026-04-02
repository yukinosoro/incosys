const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  threshold: { type: Number, required: true, min: 0 },
  created_at: { type: Date, default: Date.now },
  user_id: { type: String, required: true, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);