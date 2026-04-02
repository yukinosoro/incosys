const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /products - Add a new product
router.post('/', auth, async (req, res) => {
  const { product_id, name, quantity, price, category, threshold } = req.body;
  try {
    const product = new Product({
      product_id,
      name,
      quantity,
      price,
      category,
      threshold,
      user_id: req.user.user_id
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Product ID already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /products - Get all products for the user
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ user_id: req.user.user_id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /products/:id - Update a product
router.put('/:id', auth, async (req, res) => {
  const { name, quantity, price, category, threshold } = req.body;
  try {
    const product = await Product.findOneAndUpdate(
      { product_id: req.params.id, user_id: req.user.user_id },
      { name, quantity, price, category, threshold },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /products/:id - Delete a product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ product_id: req.params.id, user_id: req.user.user_id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;