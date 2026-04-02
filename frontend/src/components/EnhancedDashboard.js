import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  getInventoryByCategory,
  getLowStockItems,
  getTotalInventoryValue,
  getHighestStockCategory,
  getLowStockCategoryCount,
  getCategoryColor
} from '../utils/stockAnalysis';
import AlertBanner from './AlertBanner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EnhancedDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/products', { headers: { Authorization: `Bearer ${token}` } });
      const data = Array.isArray(res.data) ? res.data : [];
      console.log('Products fetched:', data);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load inventory data');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate insights
  const categoryData = Array.isArray(products) && products.length > 0 ? getInventoryByCategory(products) : [];
  const lowStockItems = Array.isArray(products) ? getLowStockItems(products) : [];
  const highestCategory = Array.isArray(products) && products.length > 0 ? getHighestStockCategory(products) : null;
  const lowStockCategoryCount = Array.isArray(products) ? getLowStockCategoryCount(products) : 0;
  const totalValue = Array.isArray(products) ? getTotalInventoryValue(products) : 0;

  // Prepare chart data - only if we have valid data
  const hasValidData = categoryData && categoryData.length > 0;

  const getBarColors = () => {
    if (!hasValidData) return [];
    return categoryData.map(cat => {
      const colorData = getCategoryColor(cat, products);
      return colorData.color;
    });
  };

  const chartData = {
    labels: hasValidData ? categoryData.map(c => c.category) : [],
    datasets: [
      {
        label: 'Total Quantity by Category',
        data: hasValidData ? categoryData.map(c => c.total) : [],
        backgroundColor: getBarColors(),
        borderColor: getBarColors(),
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: getBarColors(),
        hoverBorderColor: '#ffffff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const categoryName = categoryData[index].category;
        navigate(`/inventory?category=${encodeURIComponent(categoryName)}`);
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#ffffff',
          padding: 15,
          font: { size: 12, weight: 'bold' }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ff1e1e',
        borderWidth: 1,
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        callbacks: {
          label: function(context) {
            const index = context.dataIndex;
            const catData = categoryData[index];
            return [
              `Total Quantity: ${context.parsed.y}`,
              `Products: ${catData.count}`,
              `Total Value: $${catData.value.toFixed(2)}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#b8b8b8',
          font: { size: 11 }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#b8b8b8',
          font: { size: 11 }
        }
      }
    }
  };

  return (
    <div className="enhanced-dashboard">
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}>Inventory Dashboard</h2>

      {!alertDismissed && <AlertBanner products={products} onDismiss={() => setAlertDismissed(true)} />}

      {/* Insights Summary */}
      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-card-label">Highest Stock Category</div>
          <div className="insight-card-value">
            {highestCategory ? highestCategory.category : 'N/A'}
          </div>
          {highestCategory && (
            <div className="insight-card-subtext">{highestCategory.total} units</div>
          )}
        </div>

        <div className="insight-card">
          <div className="insight-card-label">Low Stock Categories</div>
          <div className="insight-card-value">{lowStockCategoryCount}</div>
          <div className="insight-card-subtext">
            {lowStockCategoryCount > 0 ? '⚠️ Attention needed' : '✓ All good'}
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-card-label">Total Inventory Value</div>
          <div className="insight-card-value">${totalValue.toFixed(2)}</div>
          <div className="insight-card-subtext">
            {products.length} products tracked
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-card-label">Items Needing Restock</div>
          <div className="insight-card-value">{lowStockItems.length}</div>
          <div className="insight-card-subtext">
            {lowStockItems.length > 0 ? '🔴 Action required' : '🟢 All stocked'}
          </div>
        </div>
      </div>

      {/* Interactive Chart */}
      {loading && (
        <div className="chart-container">
          <h3>📊 Inventory by Category</h3>
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading inventory data...
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="chart-container">
          <h3>📊 Inventory by Category</h3>
          <div style={{ textAlign: 'center', padding: '3rem', color: '#ff8f8f' }}>
            ⚠️ {error}
          </div>
        </div>
      )}

      {!loading && !error && hasValidData && (
        <div className="chart-container">
          <h3>📊 Inventory by Category (Click to view details)</h3>
          <div className="chart-inner">
            <Bar
              data={chartData}
              options={chartOptions}
              ref={setChartInstance}
            />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.8rem' }}>
            💡 Tip: Click on any bar to filter by that category in the Inventory page
          </p>
        </div>
      )}

      {!loading && !error && !hasValidData && (
        <div className="chart-container">
          <h3>📊 Inventory by Category</h3>
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No products available. Add products to see the inventory chart.
          </div>
        </div>
      )}

      {/* Stock Status Summary */}
      {categoryData.length > 0 && (
        <div className="summary-section">
          <h3>Summary by Category</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {categoryData.map((cat, idx) => {
              const hasLowStock = cat.items.some(p => parseInt(p.quantity) < parseInt(p.threshold));
              const lowCount = cat.items.filter(p => parseInt(p.quantity) < parseInt(p.threshold)).length;
              const colorData = getCategoryColor(cat, products);

              return (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    background: `rgba(${colorData.color === '#ff1e1e' ? '255, 30, 30' : colorData.color === '#ffd700' ? '255, 215, 0' : '0, 255, 136'}, 0.08)`,
                    border: `1px solid ${colorData.color}40`,
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: colorData.color, marginBottom: '0.5rem' }}>
                    {cat.category}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>
                    Total: <strong>{cat.total}</strong> units
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>
                    Products: <strong>{cat.count}</strong>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    Value: <strong>${cat.value.toFixed(2)}</strong>
                  </div>
                  {hasLowStock && (
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      background: 'rgba(255, 30, 30, 0.15)',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      color: '#ff8f8f'
                    }}>
                      🔴 {lowCount} item{lowCount !== 1 ? 's' : ''} low stock
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDashboard;
