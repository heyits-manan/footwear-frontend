import { api } from '@/lib/api';

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  product: string;
  rating: number;
  comment: string;
  images?: string[];
  helpful: string[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  product: string;
  rating: number;
  comment: string;
  images?: string[];
}

export interface ReviewsResponse {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
}

export const reviewService = {
  // Get reviews for a product
  getProductReviews: async (productId: string): Promise<ReviewsResponse> => {
    return api.get(`/reviews/product/${productId}`, false); // Public endpoint
  },

  // Create a review
  createReview: async (data: CreateReviewData): Promise<{ review: Review; message: string }> => {
    return api.post('/reviews', data, true); // Requires auth
  },

  // Update a review
  updateReview: async (id: string, data: Partial<CreateReviewData>): Promise<{ review: Review; message: string }> => {
    return api.put(`/reviews/${id}`, data, true); // Requires auth
  },

  // Delete a review
  deleteReview: async (id: string): Promise<{ message: string }> => {
    return api.delete(`/reviews/${id}`, true); // Requires auth
  },

  // Mark review as helpful
  markHelpful: async (id: string): Promise<{ message: string }> => {
    return api.post(`/reviews/${id}/helpful`, {}, true); // Requires auth
  },
};
