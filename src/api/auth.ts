import { apiClient } from './client';
import { User } from '../types';

export const authApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: { 
    email: string; 
    password: string; 
    isCoach: boolean;
  }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  // Other auth-related API calls can be added here later
  // like login, logout, register, etc.
}; 