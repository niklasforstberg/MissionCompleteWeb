import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { challengesApi } from '../api/challenges';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { teamsApi } from '../api/teams';
import { TeamSummary } from '../types';

enum ChallengeType {
  Cardio = 0,
  Strength = 1,
  SkillBased = 2,
  Other = 3
}

enum ChallengeFrequency {
  Daily = 0,
  Weekly = 1,
  Custom = 2
}

export default function Challenges() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newChallengeData, setNewChallengeData] = useState({
    name: '',
    description: '',
    type: ChallengeType.Cardio,
    frequency: ChallengeFrequency.Daily,
    startDate: '',
    endDate: '',
    teamId: 0
  });

  // Add state for editing
  const [editingChallengeId, setEditingChallengeId] = useState<number | null>(null);

  // Add state for delete confirmation
  const [deletingChallengeId, setDeletingChallengeId] = useState<number | null>(null);

  // Fetch challenges created by current user
  const { data: challenges, isLoading } = useQuery({
    queryKey: ['myChallenges'],
    queryFn: challengesApi.getMyChallenges,
  });

  // Add teams query
  const { data: teams } = useQuery<TeamSummary[]>({
    queryKey: ['teams'],
    queryFn: teamsApi.getTeams,
  });

  const createChallengeMutation = useMutation({
    mutationFn: challengesApi.createChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myChallenges'] });
      setIsCreateModalOpen(false);
      setNewChallengeData({
        name: '',
        description: '',
        type: ChallengeType.Cardio,
        frequency: ChallengeFrequency.Daily,
        startDate: '',
        endDate: '',
        teamId: 0
      });
    },
  });

  // Update edit mutation
  const editChallengeMutation = useMutation({
    mutationFn: (data: any) => challengesApi.updateChallenge(editingChallengeId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myChallenges'] });
      handleCloseModal();  // Use handleCloseModal instead of separate state updates
    },
  });

  // Add delete mutation
  const deleteChallengeMutation = useMutation({
    mutationFn: challengesApi.deleteChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myChallenges'] });
    },
  });

  const renderChallenge = (challenge: any) => (
    <div 
      key={challenge.id} 
      className="bg-white p-6 rounded-lg shadow flex justify-between items-center"
    >
      <div>
        <h2 className="text-xl font-semibold text-forest-green">
          {challenge.name}
        </h2>
        {challenge.description && (
          <p className="text-charcoal">{challenge.description}</p>
        )}
        <div className="flex gap-4 mt-2 text-sm text-sage-green">
          <span>Type: {challenge.type}</span>
          <span>Frequency: {challenge.frequency}</span>
          <span>
            {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => handleEdit(challenge)}
          className="p-2 text-forest-green hover:text-opacity-80"
          title="Edit challenge"
        >
          <FiEdit2 size={18} />
        </button>
        <button 
          onClick={() => setDeletingChallengeId(challenge.id)}
          className="p-2 text-red-600 hover:text-opacity-80"
          title="Delete challenge"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );

  // Update handleSubmit to wait for mutation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...newChallengeData,
      startDate: new Date(newChallengeData.startDate).toISOString(),
      endDate: new Date(newChallengeData.endDate).toISOString(),
    };
    
    if (editingChallengeId) {
      editChallengeMutation.mutate(formattedData);
    } else {
      createChallengeMutation.mutate(formattedData);
    }
  };

  // Update handleEdit function
  const handleEdit = (challenge: any) => {
    setEditingChallengeId(challenge.id);
    setNewChallengeData({
      name: challenge.name,
      description: challenge.description || '',
      type: challenge.type,
      frequency: challenge.frequency,
      startDate: new Date(challenge.startDate).toISOString().split('T')[0],
      endDate: new Date(challenge.endDate).toISOString().split('T')[0],
      teamId: challenge.teamId
    });
    setIsCreateModalOpen(true);
  };

  // Add this function to handle modal closing
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingChallengeId(null);
    setNewChallengeData({
      name: '',
      description: '',
      type: ChallengeType.Cardio,
      frequency: ChallengeFrequency.Daily,
      startDate: '',
      endDate: '',
      teamId: 0
    });
  };

  // Add modalRef
  const modalRef = useRef<HTMLDivElement>(null);

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCloseModal();
      }
    }

    if (isCreateModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCreateModalOpen]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading challenges...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-forest-green">My Challenges</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-vibrant-purple text-white px-4 py-2 rounded-lg hover:bg-vibrant-purple/90 transition-colors"
        >
          Create Challenge
        </button>
      </div>

      <div className="grid gap-4">
        {!challenges?.length ? (
          <p className="text-center text-charcoal italic">
            No challenges created yet. Click "Create Challenge" to get started.
          </p>
        ) : (
          challenges.map(renderChallenge)
        )}
      </div>

      {/* Create Challenge Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div ref={modalRef} className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingChallengeId ? 'Edit Challenge' : 'Create New Challenge'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-rich-black mb-1">
                  Challenge Name
                </label>
                <input
                  type="text"
                  value={newChallengeData.name}
                  onChange={(e) => setNewChallengeData({ ...newChallengeData, name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-rich-black mb-1">
                  Description
                </label>
                <textarea
                  value={newChallengeData.description}
                  onChange={(e) => setNewChallengeData({ ...newChallengeData, description: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-rich-black mb-1">
                    Type
                  </label>
                  <select
                    value={newChallengeData.type}
                    onChange={(e) => setNewChallengeData({ 
                      ...newChallengeData, 
                      type: parseInt(e.target.value) 
                    })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                  >
                    <option value={ChallengeType.Cardio}>Cardio</option>
                    <option value={ChallengeType.Strength}>Strength</option>
                    <option value={ChallengeType.SkillBased}>Skill Based</option>
                    <option value={ChallengeType.Other}>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-rich-black mb-1">
                    Frequency
                  </label>
                  <select
                    value={newChallengeData.frequency}
                    onChange={(e) => setNewChallengeData({ 
                      ...newChallengeData, 
                      frequency: parseInt(e.target.value) 
                    })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                  >
                    <option value={ChallengeFrequency.Daily}>Daily</option>
                    <option value={ChallengeFrequency.Weekly}>Weekly</option>
                    <option value={ChallengeFrequency.Custom}>Custom</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-rich-black mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newChallengeData.startDate}
                    onChange={(e) => setNewChallengeData({ ...newChallengeData, startDate: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-rich-black mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newChallengeData.endDate}
                    onChange={(e) => setNewChallengeData({ ...newChallengeData, endDate: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-rich-black mb-1">
                    Team
                  </label>
                  <select
                    value={newChallengeData.teamId}
                    onChange={(e) => setNewChallengeData({ 
                      ...newChallengeData, 
                      teamId: parseInt(e.target.value) 
                    })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                    required
                  >
                    <option value="">Select a team</option>
                    {teams?.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-charcoal hover:text-rich-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-vibrant-purple text-white rounded-lg hover:bg-vibrant-purple/90 transition-colors"
                >
                  {editingChallengeId ? 'Save Changes' : 'Create Challenge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {deletingChallengeId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Challenge</h2>
            <p className="text-charcoal mb-6">Are you sure you want to delete this challenge?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletingChallengeId(null)}
                className="px-4 py-2 text-charcoal hover:text-rich-black"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteChallengeMutation.mutate(deletingChallengeId);
                  setDeletingChallengeId(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 