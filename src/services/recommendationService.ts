import { api } from '../lib/api';

export const recommendationService = {
  // Get personalized recommendations (requires auth)
  getPersonalizedRecommendations: async (limit = 10) => {
    const response = await api.get('/recommendations/personalized', {
      params: { limit }
    });
    return response.data;
  },

  // Get trending products
  getTrendingProducts: async (limit = 12) => {
    const response = await api.get('/recommendations/trending', {
      params: { limit }
    });
    return response.data;
  },

  // Get new arrivals
  getNewArrivals: async (limit = 12, category?: string, gender?: string) => {
    const response = await api.get('/recommendations/new-arrivals', {
      params: { limit, category, gender }
    });
    return response.data;
  },

  // Get best sellers
  getBestSellers: async (limit = 12, category?: string, gender?: string) => {
    const response = await api.get('/recommendations/best-sellers', {
      params: { limit, category, gender }
    });
    return response.data;
  },

  // Get similar products
  getSimilarProducts: async (productId: string, limit = 8) => {
    const response = await api.get(`/recommendations/similar/${productId}`, {
      params: { limit }
    });
    return response.data;
  },

  // Get frequently bought together
  getFrequentlyBoughtTogether: async (productId: string, limit = 5) => {
    const response = await api.get(`/recommendations/frequently-bought-together/${productId}`, {
      params: { limit }
    });
    return response.data;
  },

  // Compare products
  compareProducts: async (productIds: string[]) => {
    const response = await api.get('/comparison', {
      params: { productIds: productIds.join(',') }
    });
    return response.data;
  }
};
