import React from 'react';
import { getLowStockItems } from '../utils/stockAnalysis';

const AlertBanner = ({ products, onDismiss }) => {
  const lowStockItems = getLowStockItems(products);
  
  if (lowStockItems.length === 0) {
    return null;
  }

  const itemsText = lowStockItems.length === 1 
    ? '1 product needs' 
    : `${lowStockItems.length} products need`;

  return (
    <div className="alert-banner">
      <span className="alert-banner-icon">⚠️</span>
      <div className="alert-banner-content">
        <strong>Low Stock Alert</strong>
        <p>{itemsText} restocking: {lowStockItems.map(item => item.name).join(', ')}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ffb4b4',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
