import { api } from '../lib/api';

export interface NewsletterSubscription {
  _id: string;
  email: string;
  name?: string;
  isActive: boolean;
  subscribedAt: Date;
  source: 'footer' | 'checkout' | 'popup' | 'manual';
  preferences: {
    newArrivals: boolean;
    sales: boolean;
    recommendations: boolean;
  };
}

export const newsletterService = {
  // Subscribe to newsletter
  subscribe: async (email: string, name?: string, source?: string): Promise<{ message: string }> => {
    const response = await api.post('/newsletter/subscribe', { email, name, source });
    return response.data;
  },

  // Unsubscribe from newsletter
  unsubscribe: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/newsletter/unsubscribe', { email });
    return response.data;
  },

  // Update newsletter preferences
  updatePreferences: async (email: string, preferences: any): Promise<{ message: string }> => {
    const response = await api.put('/newsletter/preferences', { email, preferences });
    return response.data;
  },

  // Admin: Get all subscribers
  getAllSubscribers: async (page = 1, limit = 50, active?: boolean) => {
    const response = await api.get('/newsletter/subscribers', {
      params: { page, limit, active }
    });
    return response.data;
  },

  // Admin: Get newsletter statistics
  getStats: async () => {
    const response = await api.get('/newsletter/stats');
    return response.data;
  },

  // Admin: Send newsletter
  sendNewsletter: async (subject: string, content: string, preferenceFilter?: string) => {
    const response = await api.post('/newsletter/send', {
      subject,
      content,
      preferenceFilter
    });
    return response.data;
  }
};
