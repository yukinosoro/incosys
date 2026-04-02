import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Graphs = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      console.log('Graphs - Products fetched:', data);
      setProducts(data);
    } catch (err) {
      console.error('Graphs - Error fetching products:', err);
      setError('Failed to load chart data');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Ensure we have valid data
  const hasValidData = Array.isArray(products) && products.length > 0;

  const barData = hasValidData ? {
    labels: products.map(p => p.name),
    datasets: [{
      label: 'Quantity',
      data: products.map(p => parseInt(p.quantity) || 0),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  } : {
    labels: [],
    datasets: [{ label: 'Quantity', data: [] }]
  };

  const pieData = hasValidData ? {
    labels: products.map(p => p.category),
    datasets: [{
      data: products.map(p => parseInt(p.quantity) || 0),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
    }]
  } : {
    labels: [],
    datasets: [{ data: [] }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      }
    },
    scales: {
      y: {
        ticks: {
          color: '#b8b8b8'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#b8b8b8'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <div>
      <h2>Graphs</h2>
      
      {loading && (
        <div><p>Loading charts...</p></div>
      )}

      {error && !loading && (
        <div style={{ color: '#ff8f8f', padding: '2rem', textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && hasValidData && (
        <>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3>Product Quantities</h3>
            <div style={{ position: 'relative', height: '400px' }}>
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
          <div className="card">
            <h3>Category Distribution</h3>
            <div style={{ position: 'relative', height: '400px' }}>
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
        </>
      )}

      {!loading && !error && !hasValidData && (
        <div style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>
          No products available. Add products to see the graphs.
        </div>
      )}
    </div>
  );
};

export default Graphs;