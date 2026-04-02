const express = require('express');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /dashboard
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ user_id: req.user.user_id });
    const transactions = await Transaction.find({ user_id: req.user.user_id }).sort({ timestamp: -1 }).limit(10);
    const alerts = products.filter(p => p.quantity <= p.threshold);
    const dashboard = {
      totalProducts: products.length,
      totalQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
      lowStockAlerts: alerts.length,
      recentTransactions: transactions
    };
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;