/**
 * Stock Analysis Utilities
 * Functions to analyze inventory and generate insights
 */

/**
 * Get low stock items (quantity < threshold)
 */
export const getLowStockItems = (products) => {
  return products.filter(p => parseInt(p.quantity) < parseInt(p.threshold));
};

/**
 * Get warning zone items (near threshold)
 * Range: threshold to threshold * 1.3
 */
export const getWarningStockItems = (products) => {
  return products.filter(p => {
    const qty = parseInt(p.quantity);
    const threshold = parseInt(p.threshold);
    return qty >= threshold && qty <= threshold * 1.3;
  });
};

/**
 * Get healthy stock items
 */
export const getHealthyStockItems = (products) => {
  return products.filter(p => {
    const qty = parseInt(p.quantity);
    const threshold = parseInt(p.threshold);
    return qty > threshold * 1.3;
  });
};

/**
 * Group products by category and sum quantities
 */
export const getInventoryByCategory = (products) => {
  const categories = {};
  
  products.forEach(product => {
    if (!categories[product.category]) {
      categories[product.category] = {
        category: product.category,
        total: 0,
        count: 0,
        value: 0,
        items: []
      };
    }
    categories[product.category].total += parseInt(product.quantity);
    categories[product.category].count += 1;
    categories[product.category].value += parseInt(product.quantity) * parseFloat(product.price);
    categories[product.category].items.push(product);
  });

  return Object.values(categories);
};

/**
 * Get stock status badge and color
 */
export const getStockStatus = (product) => {
  const qty = parseInt(product.quantity);
  const threshold = parseInt(product.threshold);

  if (qty < threshold) {
    return {
      status: 'Low Stock',
      badge: 'badge-low-stock',
      icon: '🔴',
      color: '#ff1e1e'
    };
  } else if (qty < threshold * 1.3) {
    return {
      status: 'Warning',
      badge: 'badge-warning-stock',
      icon: '🟡',
      color: '#ffd700'
    };
  } else {
    return {
      status: 'Healthy',
      badge: 'badge-healthy-stock',
      icon: '🟢',
      color: '#00ff88'
    };
  }
};

/**
 * Get category color for chart based on stock status
 */
export const getCategoryColor = (categoryData, products) => {
  const categoryProducts = categoryData.items || [];
  const lowStockCount = categoryProducts.filter(p => parseInt(p.quantity) < parseInt(p.threshold)).length;
  const warningCount = categoryProducts.filter(p => {
    const qty = parseInt(p.quantity);
    const threshold = parseInt(p.threshold);
    return qty >= threshold && qty <= threshold * 1.3;
  }).length;

  // If any products are low stock, mark category as red
  if (lowStockCount > 0) {
    return { color: '#ff1e1e', status: 'low' };
  } else if (warningCount > 0) {
    return { color: '#ffd700', status: 'warning' };
  } else {
    return { color: '#00ff88', status: 'healthy' };
  }
};

/**
 * Calculate total inventory value
 */
export const getTotalInventoryValue = (products) => {
  return products.reduce((sum, p) => sum + (parseInt(p.quantity) * parseFloat(p.price)), 0);
};

/**
 * Get highest stock category
 */
export const getHighestStockCategory = (products) => {
  const categories = getInventoryByCategory(products);
  if (categories.length === 0) return null;
  return categories.reduce((max, cat) => cat.total > max.total ? cat : max);
};

/**
 * Count categories with low stock items
 */
export const getLowStockCategoryCount = (products) => {
  const categories = getInventoryByCategory(products);
  return categories.filter(cat => {
    const hasLowStock = cat.items.some(p => parseInt(p.quantity) < parseInt(p.threshold));
    return hasLowStock;
  }).length;
};

/**
 * Calculate restock recommendations
 */
export const getRestockRecommendations = (products) => {
  const lowStockItems = getLowStockItems(products);
  return lowStockItems.map(item => ({
    ...item,
    suggestedQuantity: parseInt(item.threshold) * 2 - parseInt(item.quantity),
    suggestedCost: (parseInt(item.threshold) * 2 - parseInt(item.quantity)) * parseFloat(item.price)
  }));
};
