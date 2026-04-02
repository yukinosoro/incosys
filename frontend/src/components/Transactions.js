import React, { useEffect, useState } from 'react';
import axios from 'axios';

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch (e) {
    return iso;
  }
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/transactions', { headers: { Authorization: `Bearer ${token}` } });
      setTransactions(Array.isArray(res.data) ? res.data : []);
    };
    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Transactions</h2>
      <div className="table-area">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>User</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', color: '#aaa' }}>No transactions available</td></tr>
            )}
            {transactions.map((t) => (
              <tr key={t._id || t.id || `${t.user_id}-${t.createdAt}`}>
                <td>{t._id || t.id || 'N/A'}</td>
                <td>{formatDate(t.createdAt || t.date || t.timestamp)}</td>
                <td>{t.username || t.user_id || 'Unknown'}</td>
                <td>{t.items ? t.items.length : t.quantity || 'N/A'}</td>
                <td>${t.total?.toFixed ? t.total.toFixed(2) : t.total || '0.00'}</td>
                <td>
                  <span className={`status-pill ${t.status?.toLowerCase() === 'completed' ? 'status-complete' : t.status?.toLowerCase() === 'pending' ? 'status-pending' : 'status-alert'}`}>
                    {t.status || 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;