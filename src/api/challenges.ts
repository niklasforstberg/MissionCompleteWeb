import { apiClient } from './client';

export const challengesApi = {
  getMyChallenges: async () => {
    const response = await apiClient.get('/challenges/my');
    return response.data;
  },

  // We'll add these later when implementing create/edit/delete
  createChallenge: async (data: any) => {
    const response = await apiClient.post('/challenge', data);
    return response.data;
  },

  updateChallenge: async (id: number, data: any) => {
    const response = await apiClient.put(`/challenge/${id}`, data);
    return response.data;
  },

  deleteChallenge: async (id: number) => {
    const response = await apiClient.delete(`/challenge/${id}`);
    return response.data;
  },
}; 