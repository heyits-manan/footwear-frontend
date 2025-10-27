import { api } from '@/lib/api';

export interface OrderProduct {
  product: string;
  name: string;
  image: string;
  quantity: number;
  size: string;
  color?: string;
  price: number;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  _id: string;
  user: string | any;
  products: OrderProduct[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  tax: number;
  shippingCharge: number;
  discount: number;
  total: number;
  couponApplied?: {
    code: string;
    discount: number;
  };
  orderStatus: string;
  trackingNumber?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  products: {
    product: string;
    quantity: number;
    size: string;
    color?: string;
  }[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  couponApplied?: {
    code: string;
    discount: number;
  };
}

export const orderService = {
  // Create new order
  createOrder: async (data: CreateOrderData): Promise<{ message: string; order: Order }> => {
    return api.post('/orders', data, true);
  },

  // Get user's orders
  getUserOrders: async (): Promise<{ orders: Order[] }> => {
    return api.get('/orders', true);
  },

  // Get order by ID
  getOrderById: async (id: string): Promise<{ order: Order }> => {
    return api.get(`/orders/${id}`, true);
  },

  // Cancel order
  cancelOrder: async (
    id: string,
    reason: string
  ): Promise<{ message: string; order: Order }> => {
    return api.put(`/orders/${id}/cancel`, { reason }, true);
  },
};
