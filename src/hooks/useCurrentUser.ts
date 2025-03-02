import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { User } from '../types';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/me');
      return response.data as User;
    },
  });
} 