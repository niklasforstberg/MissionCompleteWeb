import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi } from '../api/teams';
import { TeamSummary } from '../types';
import { FiEdit2, FiX } from 'react-icons/fi';

interface TeamResponse {
  id: number;
  name: string;
  description?: string;
}

export default function Teams() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [newTeamData, setNewTeamData] = useState({ name: '', description: '' });
  const [newPlayerEmail, setNewPlayerEmail] = useState('');

  // Fetch all teams
  const { data: teams, isLoading: isLoadingTeams } = useQuery<TeamResponse[]>({
    queryKey: ['teams'],
    queryFn: teamsApi.getTeams,
  });

  // Fetch details for each team
  const teamsDetails = useQuery({
    queryKey: ['TeamDetails', teams?.map(t => t.id)],
    queryFn: async () => {
      if (!teams || teams.length === 0) return [];  // Return empty array if no teams
      return Promise.all(
        teams.map(team => teamsApi.getTeamDetails(team.id))
      );
    },
    enabled: !!teams?.length,
  });

  const createTeamMutation = useMutation({
    mutationFn: teamsApi.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setIsCreateModalOpen(false);
      setNewTeamData({ name: '', description: '' });
    },
  });

  // Add player mutation
  const addPlayerMutation = useMutation({
    mutationFn: (email: string) => 
      teamsApi.addTeamMember(editingTeamId!, { email }),
    onSuccess: () => {
      // Reset input and refresh both queries
      setNewPlayerEmail('');
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['TeamDetails'] });
    },
  });

  // Remove player mutation
  const removePlayerMutation = useMutation({
    mutationFn: (userId: number) => 
      teamsApi.removeTeamMember(editingTeamId!, userId),
    onSuccess: () => {
      // Refresh team details
      queryClient.invalidateQueries({ queryKey: ['team', editingTeamId] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    createTeamMutation.mutate(newTeamData);
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerEmail.trim()) return;
    
    try {
      await addPlayerMutation.mutateAsync(newPlayerEmail);
    } catch (error) {
      // Error handling is managed by apiClient interceptors
    }
  };

  const handleRemovePlayer = async (userId: number) => {
    try {
      await removePlayerMutation.mutateAsync(userId);
    } catch (error) {
      // Error handling is managed by apiClient interceptors
    }
  };

  const renderTeamCard = (team: TeamResponse) => {
    const isEditing = editingTeamId === team.id;
    const teamDetails = teamsDetails.data?.find(t => t.id === team.id);

    if (isEditing && teamDetails) {
      return (
        <div key={team.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-rich-black">{teamDetails.name}</h2>
            <button
              onClick={() => setEditingTeamId(null)}
              className="text-medium-gray hover:text-rich-black"
            >
              Done
            </button>
          </div>
          {teamDetails.description && (
            <p className="text-medium-gray mb-4">{teamDetails.description}</p>
          )}
          
          {/* Add Player Form */}
          <div className="mb-6">
            <form onSubmit={handleAddPlayer}>
              <label className="block text-sm font-medium text-rich-black mb-1">
                Add Player by Email
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newPlayerEmail}
                  onChange={(e) => setNewPlayerEmail(e.target.value)}
                  placeholder="player@example.com"
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-vibrant-purple focus:border-transparent"
                  required
                  disabled={addPlayerMutation.isPending}
                />
                <button
                  type="submit"
                  className="bg-vibrant-purple text-white px-4 py-2 rounded-lg hover:bg-vibrant-purple/90 transition-colors disabled:opacity-50"
                  disabled={addPlayerMutation.isPending}
                >
                  {addPlayerMutation.isPending ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>

          {/* Player List */}
          <div className="space-y-2">
            {!teamDetails.members ? (
              <p className="text-medium-gray italic">No players yet</p>
            ) : (
              <div className="space-y-2">
                {teamDetails.members.map((player) => (
                  <div
                    key={player.userId}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-rich-black">{player.email}</span>
                    <button
                      onClick={() => handleRemovePlayer(player.userId)}
                      className="text-medium-gray hover:text-red-500 p-1"
                      title="Remove player"
                      disabled={removePlayerMutation.isPending}
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={team.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-rich-black">
            {team.name}
          </h2>
          <button
            onClick={() => setEditingTeamId(team.id)}
            className="text-medium-gray hover:text-rich-black p-1"
          >
            <FiEdit2 size={18} />
          </button>
        </div>
        {team.description && (
          <p className="text-medium-gray mb-4">{team.description}</p>
        )}

        {/* Player List */}
        <div className="space-y-2">
          {!teamDetails ? (
            <div className="text-medium-gray">Loading players...</div>
          ) : !teamDetails.members ? (
            <div className="text-medium-gray">No player data available</div>
          ) : (
            <div className="space-y-1">
              {teamDetails.members
                .map((player) => (
                  <div
                    key={player.userId}
                    className="text-sm text-medium-gray flex items-center p-1"
                  >
                    <span>{player.email}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoadingTeams) {
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
        {teams?.map(renderTeamCard)}
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