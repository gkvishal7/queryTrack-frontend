import { http } from './api';

export interface LoginCredentials {
  emailId: string;
  password: string;
}

export interface AuthResponse {
  message : string
  data : {
        accessToken : string
        refreshToken : string
        emailId: string,
        username: string,
        department: string,
        phoneNumber: string,
        role: string
    }
}

export interface RegisterCredentials {
  username: string;
  emailId: string;
  phoneNumber: string;
  department: string;
  password: string;
}

export interface AuthError {
  message: string;
  field?: string;
}

// Authentication service
export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
        const response = await http.post<AuthResponse>('/public/login', credentials);
        console.log("response");
        console.log(response);
        // Store tokens
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
            }
        }
        return response;

    } catch (error: any) {
      // Handle specific error cases
      console.log(error.response)
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      if (error.response?.status === 422) {
        throw new Error('Please check your input fields');
      }
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      
      // Generic error
      throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  },

  // Register user
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
        credentials.department = credentials.department.toUpperCase();
        const response = await http.post<AuthResponse>('/public/register', credentials);
        console.log("Register response:", response);
        
        // Store tokens if registration includes them
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
            }
        }
      
        return response;
        } catch (error: any) {
        // Handle specific error cases
        console.log("Register error:", error.response.data.message);
        
        if (error.response?.status === 409) {
            throw new Error(error.response?.data.message);
        }
        if (error.response?.status === 422) {
            throw new Error('Please check your input fields');
        }
        if (error.response?.status >= 500) {
            throw new Error('Server error. Please try again later.');
        }
        if (!error.response) {
            throw new Error('Network error. Please check your connection.');
        }
        
        // Generic error
        throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
        }
    },

  // Logout user
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // You could also call a logout endpoint here if needed
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  },

  // Get current auth token
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  },
  
};
