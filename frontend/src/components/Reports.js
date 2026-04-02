import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reports = () => {
  const [report, setReport] = useState({ totalProducts: 0, totalValue: 0, lowStock: 0, transactions: 0 });

  useEffect(() => {
    const fetchReport = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/reports', { headers: { Authorization: `Bearer ${token}` } });
      setReport(res.data);
    };
    fetchReport();
  }, []);

  return (
    <div>
      <h2>Reports</h2>
      <div className="card-grid">
        <div className="list-card">
          <h3>🗡️ Total Products</h3>
          <p>{report.totalProducts || 0}</p>
        </div>
        <div className="list-card">
          <h3>🔥 Total Value</h3>
          <p>${(report.totalValue || 0).toFixed(2)}</p>
        </div>
        <div className="list-card">
          <h3>⚠️ Low Stock Items</h3>
          <p>{report.lowStock || 0}</p>
        </div>
        <div className="list-card">
          <h3>📜 Transactions</h3>
          <p>{report.transactions || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;