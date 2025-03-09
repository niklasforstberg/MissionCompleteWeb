import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

interface Team {
  id: number;
  name: string;
}

interface Challenge {
  id: number;
  name: string;
  description?: string;
  type: string;
  frequency: string;
  startDate: string;
  endDate: string;
  completionCount: number;
}

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isPlayer = user?.role === 'Player';

  // Only fetch teams if user is a player
  const { data: teams } = useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await fetch('/api/users/teams');
      if (!response.ok) throw new Error('Failed to fetch teams');
      return response.json();
    },
    enabled: isPlayer,
  });

  // Fetch challenges for each team
  const { data: challenges } = useQuery<Challenge[]>({
    queryKey: ['teamChallenges', teams?.map(t => t.id)],
    queryFn: async () => {
      if (!teams?.length) return [];
      const allChallenges = await Promise.all(
        teams.map(async team => {
          const response = await fetch(`/api/team/${team.id}/challenges`);
          if (!response.ok) throw new Error(`Failed to fetch challenges for team ${team.id}`);
          return response.json();
        })
      );
      return allChallenges.flat();
    },
    enabled: !!teams?.length,
  });

  const completeMutation = useMutation({
    mutationFn: async (challengeId: number) => {
      const response = await fetch(`/api/challenge/${challengeId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: '' }),
      });
      if (!response.ok) throw new Error('Failed to complete challenge');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamChallenges'] });
      toast.success('Challenge completed!');
    },
    onError: () => {
      toast.error('Failed to complete challenge');
    },
  });

  if (!isPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-beige to-forest-green/10 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-forest-green mb-6">Coach Dashboard</h1>
          {/* Implement coach dashboard here */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-beige to-forest-green/10 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-forest-green">My Challenges</h1>
          <p className="text-charcoal/60 mt-1">Track your progress</p>
        </div>

        <div className="grid gap-6">
          {challenges?.map(challenge => (
            <div
              key={challenge.id}
              className="bg-white p-6 rounded-xl shadow-lg flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-forest-green">
                  {challenge.name}
                </h2>
                {challenge.description && (
                  <p className="text-charcoal mt-1">{challenge.description}</p>
                )}
                <div className="flex gap-4 mt-2 text-sm text-sage-green">
                  <span>Type: {challenge.type}</span>
                  <span>Frequency: {challenge.frequency}</span>
                  <span>
                    {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => completeMutation.mutate(challenge.id)}
                disabled={completeMutation.isPending}
                className="px-6 py-2.5 bg-vibrant-purple text-white rounded-lg font-medium transition-all hover:bg-vibrant-purple/90 disabled:opacity-50"
              >
                {completeMutation.isPending ? 'Completing...' : 'Complete'}
              </button>
            </div>
          ))}

          {!challenges?.length && (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center text-charcoal/60">
              No challenges assigned yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 