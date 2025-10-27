// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to build headers
const buildHeaders = (includeAuth = false, isFormData = false) => {
  const headers: HeadersInit = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic fetch wrapper
async function fetchAPI(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false
) {
  const url = `${API_BASE_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;

  const config: RequestInit = {
    ...options,
    headers: {
      ...buildHeaders(requiresAuth, isFormData),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(error.message || 'Request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

// API methods
export const api = {
  // GET request
  get: (endpoint: string, requiresAuth = false) =>
    fetchAPI(endpoint, { method: 'GET' }, requiresAuth),

  // POST request
  post: (endpoint: string, data: any, requiresAuth = false) =>
    fetchAPI(
      endpoint,
      {
        method: 'POST',
        body: data instanceof FormData ? data : JSON.stringify(data),
      },
      requiresAuth
    ),

  // PUT request
  put: (endpoint: string, data: any, requiresAuth = false) =>
    fetchAPI(
      endpoint,
      {
        method: 'PUT',
        body: data instanceof FormData ? data : JSON.stringify(data),
      },
      requiresAuth
    ),

  // DELETE request
  delete: (endpoint: string, requiresAuth = false) =>
    fetchAPI(endpoint, { method: 'DELETE' }, requiresAuth),
};
