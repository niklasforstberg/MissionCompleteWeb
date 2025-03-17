import { apiClient } from './client';
import { Team, Challenge } from '../types';

interface CompletedChallenge {
  id: string;
  name: string;
  description: string;
  type: 'Cardio' | 'Strength' | 'SkillBased' | 'Other';
  frequency: 'Daily' | 'Weekly' | 'Custom';
  startDate: string;
  endDate: string;
  teamId: string;
  teamName: string;
  completionId: string;
  completedAt: string;
  notes?: string;
}

export async function fetchUserTeams(): Promise<Team[]> {
  const response = await apiClient.get('/user/teams');
  return response.data;
}

export async function fetchTeamChallenges(teamId: string): Promise<Challenge[]> {
  const response = await apiClient.get(`/team/${teamId}/challenges`);
  return response.data;
}

export async function fetchCompletedChallenges(): Promise<CompletedChallenge[]> {
  const response = await apiClient.get('/user/completed-challenges');
  return response.data;
}

export async function completeChallenge(challengeId: string, data: { notes?: string }) {
  const response = await apiClient.post(`/challenge/${challengeId}/complete`, data);
  return response.data;
} 