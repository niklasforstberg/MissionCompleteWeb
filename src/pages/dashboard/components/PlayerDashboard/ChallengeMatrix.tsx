import { format, isSameDay } from 'date-fns';
import { Challenge } from '../../../../types';

interface ChallengeMatrixProps {
  challenges: Challenge[];
  weekDays: Date[];
  completions: Record<string, string[]>;
  onComplete: (challengeId: string, date: Date) => void;
}

export default function ChallengeMatrix({ 
  challenges, 
  weekDays, 
  completions, 
  onComplete 
}: ChallengeMatrixProps) {
  // Check if a challenge was completed on a specific date
  const isCompleted = (challengeId: string, date: Date) => {
    if (!completions[challengeId]) return false;
    
    return completions[challengeId].some(completionDate => {
      const completed = new Date(completionDate);
      return isSameDay(completed, date);
    });
  };

  // Check if the challenge is active on a specific date
  const isActive = (challenge: Challenge, date: Date) => {
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    
    return date >= startDate && date <= endDate;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 border bg-gray-50 w-1/4">Challenge</th>
            {weekDays.map(day => (
              <th key={day.toISOString()} className="px-4 py-2 border bg-gray-50">
                {format(day, 'EEE')}<br/>
                <span className="text-sm">{format(day, 'MMM d')}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {challenges.map(challenge => (
            <tr key={challenge.id}>
              <td className="px-4 py-2 border">
                <div className="font-medium">{challenge.name}</div>
                <div className="text-xs text-gray-500">{challenge.type}</div>
              </td>
              
              {weekDays.map(day => {
                const active = isActive(challenge, day);
                const completed = isCompleted(challenge.id, day);
                
                return (
                  <td 
                    key={day.toISOString()} 
                    className={`px-4 py-2 border text-center ${!active ? 'bg-gray-100' : ''}`}
                  >
                    {active && (
                      <button
                        onClick={() => onComplete(challenge.id, day)}
                        disabled={completed}
                        className={`w-6 h-6 rounded-md ${
                          completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-white border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {completed ? '✓' : ''}
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 