import { api } from '../lib/api';

export interface ReturnItem {
  product: string;
  name: string;
  image: string;
  quantity: number;
  size: string;
  color?: string;
  price: number;
  reason: string;
  reasonDetails?: string;
}

export interface Return {
  _id: string;
  order: string;
  user: string;
  items: ReturnItem[];
  returnType: 'Refund' | 'Exchange';
  refundAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Picked Up' | 'Received' | 'Inspected' | 'Completed' | 'Cancelled';
  pickupAddress: any;
  images?: string[];
  trackingNumber?: string;
  adminNotes?: string;
  rejectionReason?: string;
  refundMethod?: string;
  refundTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const returnService = {
  // Create return request
  createReturn: async (data: {
    orderId: string;
    items: Array<{
      productId: string;
      quantity: number;
      reason: string;
      reasonDetails?: string;
    }>;
    returnType: 'Refund' | 'Exchange';
    pickupAddress?: any;
    images?: string[];
  }): Promise<{ message: string; return: Return }> => {
    const response = await api.post('/returns', data);
    return response.data;
  },

  // Get user's returns
  getUserReturns: async (page = 1, limit = 10, status?: string) => {
    const response = await api.get('/returns/my-returns', {
      params: { page, limit, status }
    });
    return response.data;
  },

  // Get return by ID
  getReturnById: async (id: string): Promise<Return> => {
    const response = await api.get(`/returns/${id}`);
    return response.data;
  },

  // Cancel return request
  cancelReturn: async (id: string): Promise<{ message: string; return: Return }> => {
    const response = await api.put(`/returns/${id}/cancel`);
    return response.data;
  },

  // Admin: Get all returns
  getAllReturns: async (page = 1, limit = 20, status?: string, startDate?: string, endDate?: string) => {
    const response = await api.get('/returns/admin/all', {
      params: { page, limit, status, startDate, endDate }
    });
    return response.data;
  },

  // Admin: Update return status
  updateReturnStatus: async (id: string, data: {
    status: string;
    adminNotes?: string;
    rejectionReason?: string;
    refundMethod?: string;
    refundTransactionId?: string;
  }) => {
    const response = await api.put(`/returns/admin/${id}/status`, data);
    return response.data;
  },

  // Admin: Get return statistics
  getReturnStats: async () => {
    const response = await api.get('/returns/admin/stats');
    return response.data;
  }
};
