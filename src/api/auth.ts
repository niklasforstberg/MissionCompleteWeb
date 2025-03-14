import { apiClient } from './client';
import { User } from '../types';

export const authApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    return {
      token: response.data.token,
      user: response.data.user // Assuming the API returns user data with the token
    };
  },

  register: async (data: { 
    email: string; 
    password: string; 
    isCoach: boolean;
  }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  setPassword: async (data: { password: string }) => {
    const response = await apiClient.post('/auth/set-password', data);
    return response.data;
  },

  setInitialPassword: async (data: { token: string; password: string }) => {
    const response = await apiClient.post('/auth/set-password', {
      token: data.token,
      password: data.password
    });
    return {
      token: response.data.token,
      user: response.data.user
    };
  },

  // Other auth-related API calls can be added here later
  // like login, logout, register, etc.
}; 