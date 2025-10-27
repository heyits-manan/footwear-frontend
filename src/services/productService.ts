import { api } from '@/lib/api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  gender?: 'Men' | 'Women' | 'Unisex';
  brand: string;
  sizes: { size: string; stock: number }[];
  colors: string[];
  images: string[];
  totalStock: number;
  averageRating: number;
  totalReviews: number;
  featured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export const productService = {
  // Get all products with filters
  getProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    return api.get(`/products${queryString ? `?${queryString}` : ''}`);
  },

  // Get product by ID
  getProductById: async (id: string): Promise<{ product: Product }> => {
    return api.get(`/products/${id}`);
  },

  // Get featured products
  getFeaturedProducts: async (): Promise<{ products: Product[] }> => {
    return api.get('/products/featured');
  },

  // Get related products
  getRelatedProducts: async (id: string): Promise<{ products: Product[] }> => {
    return api.get(`/products/${id}/related`);
  },

  // Get categories
  getCategories: async (): Promise<{ categories: string[] }> => {
    return api.get('/products/categories');
  },

  // Get brands
  getBrands: async (): Promise<{ brands: string[] }> => {
    return api.get('/products/brands');
  },
};
