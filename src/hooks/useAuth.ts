import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import type { User } from '../types/user';

export function useAuth() {
  const { 
    data: user, 
    isLoading,
    error 
  } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: () => usersApi.getCurrentUser(),
    enabled: !!localStorage.getItem('jwt'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return { 
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    role: user?.role,
    isPlayer: user?.role === 'Player',
    isCoach: user?.role === 'Coach',
    isAdmin: user?.role === 'Admin',
  };
} 