import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-off-white">
      <nav className="bg-rich-black text-off-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <Link 
              to="/" 
              className="text-off-white hover:text-vibrant-purple/90 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link 
              to="/teams" 
              className="text-off-white hover:text-vibrant-purple/90 transition-colors font-medium"
            >
              Teams
            </Link>
            <Link 
              to="/challenges" 
              className="text-off-white hover:text-vibrant-purple/90 transition-colors font-medium"
            >
              Challenges
            </Link>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 text-off-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
} 