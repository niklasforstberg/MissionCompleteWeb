export type UserRole = 'Player' | 'Coach' | 'Admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  // ... other user properties
} 