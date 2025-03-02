export interface User {
  id: string;
  email: string;
  role: 'Player' | 'Coach' | 'Admin';
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'Cardio' | 'Strength' | 'SkillBased' | 'Other';
  frequency: 'Daily' | 'Weekly' | 'Custom';
  startDate: string;
  endDate: string;
  createdAt: string;
  teamId: string;
}

export interface TeamMember {
  id: number;
  email: string;
  joinedAt: string;
}

export interface TeamDetails {
  id: number;
  name: string;
  description?: string;
  players: TeamMember[];
  coaches: TeamMember[];
}

export interface TeamSummary {
  id: number;
  name: string;
  description?: string;
  playerCount: number;
} 