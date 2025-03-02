import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi } from '../api/teams';
import { TeamSummary } from '../types';

export default function Teams() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTeamData, setNewTeamData] = useState({ name: '', description: '' });

  const { data: teams, isLoading } = useQuery<TeamSummary[]>({
    queryKey: ['teams'],
    queryFn: teamsApi.getTeams,
  });

  const createTeamMutation = useMutation({
    mutationFn: teamsApi.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setIsCreateModalOpen(false);
      setNewTeamData({ name: '', description: '' });
    },
  });

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    createTeamMutation.mutate(newTeamData);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading teams...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-rich-black">Teams</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-vibrant-purple text-white px-4 py-2 rounded-lg hover:bg-vibrant-purple/90 transition-colors"
        >
          Create Team
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teams?.map((team) => (
          <div key={team.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-rich-black mb-2">
              {team.name}
            </h2>
            {team.description && (
              <p className="text-medium-gray mb-4">{team.description}</p>
            )}
            <div className="flex justify-between items-center text-sm text-medium-gray">
              <span>{team.playerCount} Players</span>
              <button className="text-vibrant-purple hover:text-vibrant-purple/80">
                Manage Team →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Team</h2>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-rich-black mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={newTeamData.name}
                  onChange={(e) => setNewTeamData({ ...newTeamData, name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-vibrant-purple focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-rich-black mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={newTeamData.description}
                  onChange={(e) => setNewTeamData({ ...newTeamData, description: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-vibrant-purple focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-medium-gray hover:text-rich-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-vibrant-purple text-white rounded-lg hover:bg-vibrant-purple/90"
                  disabled={createTeamMutation.isPending}
                >
                  {createTeamMutation.isPending ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 