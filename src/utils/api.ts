import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

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
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add request timestamp
    if (config.headers) {
      config.headers['X-Request-Timestamp'] = new Date().toISOString();
    }

    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default api;

// Export types for use in components
export type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError };

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