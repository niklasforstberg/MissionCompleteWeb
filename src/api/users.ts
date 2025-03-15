import { apiClient } from './client';
import { User } from '../types/user';

export const usersApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  
  // Other user-related API calls
  updateUser: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch(`/users/${userId}`, data);
    return response.data;
  },
  // ... etc
}; 