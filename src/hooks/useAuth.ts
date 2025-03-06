import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth';

export function useAuth() {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.getCurrentUser(),
    // Don't try to fetch if no token exists
    enabled: !!localStorage.getItem('jwt'),
    // Don't show error if not logged in
    retry: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  return { user, isAuthenticated: !!user };
} 