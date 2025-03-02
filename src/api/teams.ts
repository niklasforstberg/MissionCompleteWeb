import { apiClient } from './client';
import { TeamDetails, TeamSummary } from '../types';

export const teamsApi = {
  getTeams: async (): Promise<TeamSummary[]> => {
    const response = await apiClient.get('/teams');
    return response.data;
  },

  createTeam: async (data: { name: string; description?: string }) => {
    const response = await apiClient.post('/teams', data);
    return response.data;
  },

  getTeamDetails: async (id: number): Promise<TeamDetails> => {
    const response = await apiClient.get(`/teams/${id}`);
    return response.data;
  },

  addTeamMember: async (teamId: number, data: { userId: number; role: 'Player' | 'Coach' }) => {
    const response = await apiClient.post(`/teams/${teamId}/members`, data);
    return response.data;
  },

  removeTeamMember: async (teamId: number, userId: number) => {
    const response = await apiClient.delete(`/teams/${teamId}/members/${userId}`);
    return response.data;
  },
}; 