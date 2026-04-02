import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/alerts', { headers: { Authorization: `Bearer ${token}` } });
        const data = Array.isArray(res.data) ? res.data : [];
        console.log('Alerts fetched:', data);
        setAlerts(data);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError('Failed to load alerts');
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [token]);

  if (loading) {
    return (
      <div>
        <h2>Alerts</h2>
        <div className="list-card">
          <p>Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Alerts</h2>
        <div className="list-card" style={{ color: '#ff8f8f' }}>
          <p>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Alerts</h2>
      <div className="card-grid">
        {alerts.length === 0 && (
          <div className="list-card">
            <h3>No active alerts</h3>
            <p>All inventory levels are within safe thresholds.</p>
          </div>
        )}
        {alerts.length > 0 && alerts.map((item, idx) => {
          const itemName = item?.name || item?.product_name || `Item ${idx + 1}`;
          const quantity = item?.quantity || item?.qty || 'N/A';
          const threshold = item?.threshold || 'N/A';

          return (
            <div key={idx} className="list-card" style={{ borderLeft: '3px solid #ff1e1e' }}>
              <h3>⚠️ Low stock: {itemName}</h3>
              <p>Quantity: <strong>{quantity}</strong></p>
              <p>Threshold: <strong>{threshold}</strong></p>
              <span className="badge-warning">Critical</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Alerts;