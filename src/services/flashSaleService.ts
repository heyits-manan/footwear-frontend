import { api } from '../lib/api';

export interface FlashSaleProduct {
  product: any;
  originalPrice: number;
  flashPrice: number;
  discountPercentage: number;
  stockLimit: number;
  soldCount: number;
  isActive: boolean;
}

export interface FlashSale {
  _id: string;
  name: string;
  description?: string;
  products: FlashSaleProduct[];
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  banner?: string;
  priority: number;
  maxItemsPerUser?: number;
  notificationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const flashSaleService = {
  // Get active flash sales
  getActiveFlashSales: async (): Promise<FlashSale[]> => {
    const response = await api.get('/flash-sales/active');
    return response.data;
  },

  // Get upcoming flash sales
  getUpcomingFlashSales: async (): Promise<FlashSale[]> => {
    const response = await api.get('/flash-sales/upcoming');
    return response.data;
  },

  // Get flash sale by ID
  getFlashSaleById: async (id: string) => {
    const response = await api.get(`/flash-sales/${id}`);
    return response.data;
  },

  // Check if product is in active flash sale
  getProductFlashPrice: async (productId: string) => {
    const response = await api.get(`/flash-sales/product/${productId}/price`);
    return response.data;
  },

  // Admin: Create flash sale
  createFlashSale: async (data: {
    name: string;
    description?: string;
    products: Array<{
      productId: string;
      flashPrice: number;
      stockLimit: number;
    }>;
    startTime: Date;
    endTime: Date;
    banner?: string;
    priority?: number;
    maxItemsPerUser?: number;
  }) => {
    const response = await api.post('/flash-sales/admin', data);
    return response.data;
  },

  // Admin: Update flash sale
  updateFlashSale: async (id: string, data: any) => {
    const response = await api.put(`/flash-sales/admin/${id}`, data);
    return response.data;
  },

  // Admin: Delete flash sale
  deleteFlashSale: async (id: string) => {
    const response = await api.delete(`/flash-sales/admin/${id}`);
    return response.data;
  },

  // Admin: Get all flash sales
  getAllFlashSales: async (page = 1, limit = 20, status?: string) => {
    const response = await api.get('/flash-sales/admin/all/list', {
      params: { page, limit, status }
    });
    return response.data;
  },

  // Admin: Notify users about upcoming flash sale
  notifyUpcomingFlashSale: async (id: string) => {
    const response = await api.post(`/flash-sales/admin/${id}/notify`);
    return response.data;
  }
};
