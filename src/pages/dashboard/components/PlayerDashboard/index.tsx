import { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval } from 'date-fns';
import { Challenge, Team } from '../../../../types';
import { fetchUserTeams, fetchTeamChallenges, fetchCompletedChallenges, completeChallenge } from '../../../../api/player';
import WeekNavigation from './WeekNavigation';
import ChallengeMatrix from './ChallengeMatrix';

export default function PlayerDashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamChallenges, setTeamChallenges] = useState<Record<string, Challenge[]>>({});
  const [completions, setCompletions] = useState<Record<string, string[]>>({});
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate week dates
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch user's teams
        const userTeams = await fetchUserTeams();
        setTeams(userTeams);
        
        // Fetch challenges for each team
        const challengesByTeam: Record<string, Challenge[]> = {};
        for (const team of userTeams) {
          const challenges = await fetchTeamChallenges(team.id);
          challengesByTeam[team.id] = challenges;
        }
        setTeamChallenges(challengesByTeam);
        
        // Fetch completed challenges
        const completedChallenges = await fetchCompletedChallenges();
        const completionMap: Record<string, string[]> = {};
        
        // Create a map of challenge ID to completion dates
        completedChallenges.forEach(completion => {
          if (!completionMap[completion.id]) {
            completionMap[completion.id] = [];
          }
          completionMap[completion.id].push(completion.completedAt);
        });
        
        setCompletions(completionMap);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  const navigateToPreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const navigateToNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const navigateToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  const handleChallengeComplete = async (challengeId: string, date: Date) => {
    try {
      const result = await completeChallenge(challengeId, { notes: '' });
      
      // Update the completions state with the new completion
      setCompletions(prev => {
        const newCompletions = { ...prev };
        if (!newCompletions[challengeId]) {
          newCompletions[challengeId] = [];
        }
        newCompletions[challengeId].push(result.completedAt);
        return newCompletions;
      });
    } catch (err) {
      setError('Failed to complete challenge. Please try again.');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Player Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <p>Loading your challenges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Player Dashboard</h1>
        <div className="bg-red-50 p-4 rounded shadow border border-red-200">
          <p className="text-red-700">{error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Player Dashboard</h1>
      
      <WeekNavigation 
        weekStart={weekStart}
        weekEnd={weekEnd}
        onPreviousWeek={navigateToPreviousWeek}
        onNextWeek={navigateToNextWeek}
        onCurrentWeek={navigateToCurrentWeek}
      />
      
      {teams.length === 0 ? (
        <div className="bg-white p-4 rounded shadow">
          <p>You are not a member of any teams yet.</p>
          <p>Your challenges will appear here once you join a team.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {teams.map(team => (
            <div key={team.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-3">{team.name}</h2>
              {team.description && <p className="text-gray-600 mb-4">{team.description}</p>}
              
              {teamChallenges[team.id]?.length > 0 ? (
                <ChallengeMatrix 
                  challenges={teamChallenges[team.id]}
                  weekDays={weekDays}
                  completions={completions}
                  onComplete={handleChallengeComplete}
                />
              ) : (
                <p>No challenges assigned to this team yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 