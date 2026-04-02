const express = require('express');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /reports
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ user_id: req.user.user_id });
    const transactions = await Transaction.find({ user_id: req.user.user_id });
    const report = {
      totalProducts: products.length,
      totalValue: products.reduce((sum, p) => sum + p.quantity * p.price, 0),
      lowStock: products.filter(p => p.quantity <= p.threshold).length,
      transactions: transactions.length
    };
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;