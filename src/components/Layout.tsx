import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-sage-green">
      <nav className="bg-forest-green text-soft-beige p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <Link to="/">Dashboard</Link>
            <Link to="/teams">Teams</Link>
            <Link to="/challenges">Challenges</Link>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
} 