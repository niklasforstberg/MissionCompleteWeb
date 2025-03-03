import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { User } from '../types';

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
  });
} 