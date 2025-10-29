import { api } from '../lib/api';

export const analyticsService = {
  // Get comprehensive dashboard analytics
  getDashboardAnalytics: async (startDate?: string, endDate?: string) => {
    const response = await api.get('/analytics/dashboard', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Get sales analytics by time period
  getSalesAnalytics: async (period = 'daily', startDate?: string, endDate?: string) => {
    const response = await api.get('/analytics/sales', {
      params: { period, startDate, endDate }
    });
    return response.data;
  },

  // Get product performance analytics
  getProductAnalytics: async (limit = 20, sortBy = 'revenue') => {
    const response = await api.get('/analytics/products', {
      params: { limit, sortBy }
    });
    return response.data;
  },

  // Get customer analytics
  getCustomerAnalytics: async (limit = 20) => {
    const response = await api.get('/analytics/customers', {
      params: { limit }
    });
    return response.data;
  },

  // Get inventory analytics
  getInventoryAnalytics: async () => {
    const response = await api.get('/analytics/inventory');
    return response.data;
  },

  // Get conversion funnel analytics
  getConversionAnalytics: async () => {
    const response = await api.get('/analytics/conversion');
    return response.data;
  }
};
