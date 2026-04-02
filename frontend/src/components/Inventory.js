import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';
import { getStockStatus, getLowStockItems } from '../utils/stockAnalysis';
import AlertBanner from './AlertBanner';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ product_id: '', name: '', quantity: '', price: '', category: '', threshold: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [alertDismissed, setAlertDismissed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchProducts();
    
    // Check for category filter in URL
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [location.search]);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from API:', process.env.REACT_APP_API_URL || 'http://localhost:5000');
      const res = await api.get('/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
      console.log('Fetched products:', res.data);
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message || error);
      window.alert('Failed to fetch products. Check console for details.');
    }
  };

  const resetForm = () => {
    setForm({ product_id: '', name: '', quantity: '', price: '', category: '', threshold: '' });
    setEditingId(null);
  };

  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Submit product payload:', form);

      if (editingId) {
        await api.put(`/products/${editingId}`, {
          name: form.name,
          quantity: form.quantity,
          price: form.price,
          category: form.category,
          threshold: form.threshold
        });
        setFeedback('Product updated successfully.');
      } else {
        await api.post('/products', form);
        setFeedback('Product added successfully.');
      }

      resetForm();
      await fetchProducts();

      // clear transient feedback after 3s
      setTimeout(() => setFeedback(''), 3000);
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message || error);
      setFeedback('Failed to submit product. Check console for details.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      await fetchProducts();

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error.message || error);
      window.alert('Failed to delete product. Check console for details.');
    }
  };

  const handleEdit = (product) => {
    setForm({
      product_id: product.product_id,
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      category: product.category,
      threshold: product.threshold
    });
    setEditingId(product.product_id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))].sort();

  // Filter products based on search and category
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.product_id.toString().includes(searchTerm);
    const matchesCategory = selectedCategory === '' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products: low stock first
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const statusA = getStockStatus(a);
    const statusB = getStockStatus(b);
    const order = { 'Low Stock': 0, 'Warning': 1, 'Healthy': 2 };
    return order[statusA.status] - order[statusB.status];
  });

  const lowStockCount = getLowStockItems(products).length;

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}>Inventory Management</h2>

      {!alertDismissed && <AlertBanner products={products} onDismiss={() => setAlertDismissed(true)} />}

      {/* Add/Edit Product Form */}
      <div className="card">
        <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit}>
          {feedback && <div style={{ marginBottom: '0.8rem', color: '#44ff44' }}>{feedback}</div>}
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '0.7rem' }}>
            <input
              className="neon-input"
              placeholder="Product ID"
              value={form.product_id}
              onChange={(e) => setForm({ ...form, product_id: e.target.value })}
              required
              disabled={!!editingId}
            />
            <input className="neon-input" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
            <input className="neon-input" type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})} required />
            <input className="neon-input" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required />
            <input className="neon-input" placeholder="Category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} required />
            <input className="neon-input" type="number" placeholder="Threshold" value={form.threshold} onChange={(e) => setForm({...form, threshold: e.target.value})} required />
          </div>
          <button className={`btn ${editingId ? 'btn-edit' : 'btn-add'}`} type="submit">
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button type="button" className="btn" onClick={resetForm} style={{ marginLeft: '0.5rem' }}>
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Filters and Search */}
      <div className="inventory-controls">
        <div className="search-group">
          <label>Search Products</label>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Filter by Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="inventory-stats">
        <div className="stat-item">
          <div className="stat-item-label">Total Products</div>
          <div className="stat-item-value">{filteredProducts.length}</div>
        </div>
        <div className="stat-item">
          <div className="stat-item-label">Low Stock Items</div>
          <div className="stat-item-value" style={{ color: '#ff8f8f' }}>{getLowStockItems(filteredProducts).length}</div>
        </div>
        <div className="stat-item">
          <div className="stat-item-label">Total Value</div>
          <div className="stat-item-value">${filteredProducts.reduce((sum, p) => sum + (parseInt(p.quantity) * parseFloat(p.price)), 0).toFixed(2)}</div>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-area">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Product ID</th>
              <th>Name</th>
              <th>Qty</th>
              <th>Threshold</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((p) => {
              const status = getStockStatus(p);
              const isLowStock = parseInt(p.quantity) < parseInt(p.threshold);
              const isWarning = parseInt(p.quantity) < parseInt(p.threshold) * 1.3 && !isLowStock;
              const rowClass = isLowStock ? 'table-row-low-stock' : isWarning ? 'table-row-warning-stock' : '';

              return (
                <tr key={p.product_id} className={rowClass}>
                  <td>
                    <span className={`badge ${status.badge}`}>
                      {status.icon} {status.status}
                    </span>
                  </td>
                  <td>{p.product_id}</td>
                  <td>{p.name}</td>
                  <td style={{ fontWeight: 'bold', color: status.color }}>{p.quantity}</td>
                  <td>{p.threshold}</td>
                  <td>${parseFloat(p.price).toFixed(2)}</td>
                  <td>{p.category}</td>
                  <td className="btn-group">
                    <button className="btn btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn btn-delete" onClick={() => handleDelete(p.product_id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
            {sortedProducts.length === 0 && (
              <tr><td colSpan="8" style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}>
                {products.length === 0 ? 'No products available.' : 'No products match your filters.'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;