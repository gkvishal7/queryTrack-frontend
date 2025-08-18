import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { AuthResponse } from './auth';

// API configuration interface
interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// Default API configuration
const defaultConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create axios instance
const api: AxiosInstance = axios.create(defaultConfig);
// Public endpoints where token should NOT be added
const publicEndpoints = ['/public/login', '/public/register', '/forgot-password'];

api.interceptors.request.use(
  (config: any) => {
    // Check if the request URL matches a public endpoint
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (!isPublicEndpoint) {
      // Add authentication token if available
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add request timestamp
    if (config.headers) {
      config.headers['X-Request-Timestamp'] = new Date().toISOString();
    }

    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log('Request Headers:', config.headers);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Helper to add request to subscribers
const addSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Helper to retry failed requests
const retryFailedRequests = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Check if it's a public endpoint
      const isPublicEndpoint = publicEndpoints.some((endpoint) =>
        originalRequest.url?.includes(endpoint)
      );

      if (!isPublicEndpoint) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            // Attempt to refresh the token
            const newToken = await refreshAccessToken();
            
            // Update header for the original request
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            
            // Notify all subscribers with new token
            retryFailedRequests(newToken);
            
            // Retry the original request
            return api(originalRequest);
          } catch (refreshError: any) {
            // If refresh fails, reject all subscribers
            refreshSubscribers = [];
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          // If we're already refreshing, wait for the new token
          return new Promise(resolve => {
            addSubscriber(token => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(api(originalRequest));
            });
          });
        }
      }
    }

    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default api;

// Export types for use in components
export type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError };

// Function to refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post<AuthResponse>(
      `${defaultConfig.baseURL}/public/refresh`,
      { refreshToken }
    );

    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      if (response.data.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
      return response.data.data.accessToken;
    }

    throw new Error('No access token in refresh response');
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Refresh token has expired
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      throw new Error('Please Login Again to Continue');
    }
    throw error;
  }
};

// Export common HTTP methods for convenience
export const http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.get<T>(url, config).then(response => response.data),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.post<T>(url, data, config).then(response => response.data),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.put<T>(url, data, config).then(response => response.data),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.patch<T>(url, data, config).then(response => response.data),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.delete<T>(url, config).then(response => response.data),
}; 