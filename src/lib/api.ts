import axios from 'axios';
import { AuthResponse, ApiResponse, LoginData, SignupData, UpdateUserData, SalesAnalytics } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },
};

export const userAPI = {
  getProfile: async (): Promise<ApiResponse> => {
    const response = await api.get('/api/user/me');
    return response.data;
  },

  updateProfile: async (data: UpdateUserData): Promise<ApiResponse> => {
    const response = await api.put('/api/user/update', data);
    return response.data;
  },
};

export const adminAPI = {
  getAnalytics: async (): Promise<{ success: boolean; data: SalesAnalytics }> => {
    const response = await api.get('/api/admin/analytics');
    return response.data;
  },

  getUsers: async (): Promise<ApiResponse> => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },

  getTransactions: async (): Promise<ApiResponse> => {
    const response = await api.get('/api/admin/transactions');
    return response.data;
  },

  updateUserTickets: async (userId: string, tickets: number): Promise<ApiResponse> => {
    const response = await api.put(`/api/admin/users/${userId}/tickets`, { tickets });
    return response.data;
  },
};

export { api };
export default api;

