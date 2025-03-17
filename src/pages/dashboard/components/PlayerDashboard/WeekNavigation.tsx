import { format } from 'date-fns';

interface WeekNavigationProps {
  weekStart: Date;
  weekEnd: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
}

export default function WeekNavigation({ 
  weekStart, 
  weekEnd, 
  onPreviousWeek, 
  onNextWeek, 
  onCurrentWeek 
}: WeekNavigationProps) {
  return (
    <div className="flex items-center justify-between mb-6 bg-white p-3 rounded shadow">
      <button 
        onClick={onPreviousWeek}
        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
      >
        Previous Week
      </button>
      
      <div className="flex flex-col items-center">
        <span className="font-semibold">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </span>
        <button 
          onClick={onCurrentWeek}
          className="text-sm text-blue-600 hover:underline"
        >
          Go to Current Week
        </button>
      </div>
      
      <button 
        onClick={onNextWeek}
        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
      >
        Next Week
      </button>
    </div>
  );
} 