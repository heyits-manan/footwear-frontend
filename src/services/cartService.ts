import { api } from '../lib/api';

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
    discountPrice?: number;
  };
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  size: string;
  color?: string;
  addedAt: Date;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  createdAt: Date;
  updatedAt: Date;
}

export const cartService = {
  // Get user's cart
  getCart: async (): Promise<Cart> => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId: string, quantity: number, size: string, color?: string): Promise<Cart> => {
    const response = await api.post('/cart/add', {
      productId,
      quantity,
      size,
      color
    });
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const response = await api.put(`/cart/item/${itemId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId: string): Promise<Cart> => {
    const response = await api.delete(`/cart/item/${itemId}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async (): Promise<Cart> => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  // Sync cart with latest product data
  syncCart: async (): Promise<{ cart: Cart; hasChanges: boolean; removedItems: number }> => {
    const response = await api.post('/cart/sync');
    return response.data;
  }
};
