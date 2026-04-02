import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState({ totalProducts: 0, totalValue: 0, lowStockAlerts: 0, transactions: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/dashboard', { headers: { Authorization: `Bearer ${token}` } });
      setData(res.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="card-grid">
        <div className="stats-card card-small">
          <h4>Total Products</h4>
          <strong>{data.totalProducts || 0}</strong>
        </div>
        <div className="stats-card card-small">
          <h4>Total Value</h4>
          <strong>${(data.totalValue || 0).toFixed(2)}</strong>
        </div>
        <div className="stats-card card-small">
          <h4>Low Stock Alerts</h4>
          <strong>{data.lowStockAlerts || 0}</strong>
        </div>
        <div className="stats-card card-small">
          <h4>Transactions</h4>
          <strong>{data.transactions || 0}</strong>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;