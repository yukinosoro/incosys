const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /alerts
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ user_id: req.user.user_id });
    const alerts = products.filter(product => product.quantity <= product.threshold);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;