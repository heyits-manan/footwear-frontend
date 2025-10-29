import { api } from '../lib/api';

export interface Notification {
  _id: string;
  user: string;
  type: 'order' | 'product' | 'promotion' | 'system' | 'review' | 'wishlist';
  title: string;
  message: string;
  link?: string;
  icon?: string;
  relatedId?: string;
  relatedModel?: 'Order' | 'Product' | 'Coupon' | 'Review';
  isRead: boolean;
  readAt?: Date;
  priority: 'low' | 'medium' | 'high';
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const notificationService = {
  // Get user notifications
  getNotifications: async (page = 1, limit = 20, unreadOnly = false) => {
    const response = await api.get('/notifications', {
      params: { page, limit, unreadOnly }
    });
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async (): Promise<{ message: string; updated: number }> => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  // Delete all read notifications
  deleteAllRead: async (): Promise<{ message: string; deleted: number }> => {
    const response = await api.delete('/notifications/read/all');
    return response.data;
  }
};
