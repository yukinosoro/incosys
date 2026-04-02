const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transaction_id: { type: String, required: true, unique: true },
  product_id: { type: String, required: true, ref: 'Product' },
  type: { type: String, enum: ['IN', 'OUT'], required: true },
  quantity: { type: Number, required: true, min: 1 },
  timestamp: { type: Date, default: Date.now },
  user_id: { type: String, required: true, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);