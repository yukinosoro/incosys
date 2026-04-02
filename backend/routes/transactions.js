const express = require('express');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /transactions
router.post('/', auth, async (req, res) => {
  const { product_id, type, quantity } = req.body;
  try {
    const product = await Product.findOne({ product_id, user_id: req.user.user_id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (type === 'OUT' && product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    const transaction = new Transaction({
      transaction_id: Date.now().toString(), // Simple ID generation
      product_id,
      type,
      quantity,
      user_id: req.user.user_id
    });
    await transaction.save();
    // Update product quantity
    if (type === 'IN') {
      product.quantity += quantity;
    } else {
      product.quantity -= quantity;
    }
    await product.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /transactions
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user_id: req.user.user_id }).populate('product_id');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;