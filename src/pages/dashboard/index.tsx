import { useAuth } from '../../hooks/useAuth';
import PlayerDashboard from './components/PlayerDashboard';
import CoachDashboard from './components/CoachDashboard';
import AdminDashboard from './components/AdminDashboard';

export default function Dashboard() {
  const { user, isLoading, error } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading dashboard</div>;
  }

  switch(user?.role) {
    case 'Player':
      return <PlayerDashboard />;
    case 'Coach':
      return <CoachDashboard />;
    case 'Admin':
      return <AdminDashboard />;
    default:
      return <div>Invalid role</div>;
  }
} 