const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Seeding data...');
  try {
    // Clean existing records
    await User.deleteMany({});
    await Product.deleteMany({});

    // Hash manager password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Insert manager user with hashed password
    await User.insertMany([{ 
      user_id: 'U001',
      username: 'manager',
      password: hashedPassword,
      role: 'Manager'
    }]);

    // Create some products
    const products = [
      { product_id: 'P001', name: 'Laptop', quantity: 10, price: 1000, category: 'Electronics', threshold: 5, user_id: 'U001' },
      { product_id: 'P002', name: 'Mouse', quantity: 50, price: 20, category: 'Electronics', threshold: 10, user_id: 'U001' },
      { product_id: 'P003', name: 'Keyboard', quantity: 3, price: 50, category: 'Electronics', threshold: 5, user_id: 'U001' }
    ];
    await Product.insertMany(products);

    console.log('Data seeded successfully');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    mongoose.connection.close();
  }
}).catch(err => console.error('Connection error:', err));