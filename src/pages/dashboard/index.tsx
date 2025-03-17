import { useAuth } from '../../hooks/useAuth';
import PlayerDashboard from './components/PlayerDashboard';
import CoachDashboard from './components/CoachDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  const isCoach = user?.role === 'Coach' || user?.role === 'Admin';

  // Render different dashboards based on user role
  return isCoach ? <CoachDashboard /> : <PlayerDashboard />;
} 