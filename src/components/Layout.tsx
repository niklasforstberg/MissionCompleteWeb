import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FaUser } from 'react-icons/fa'; 
import { useAuth } from '../hooks/useAuth';

export default function Layout() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const isStaff = user?.role === 'Coach' || user?.role === 'Admin';
  console.log('User role:', user?.role, 'isStaff:', isStaff);
  
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            {isStaff && (
              <>
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
              </>
            )}
          </div>
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <FaUser size={20} />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                <Link
                  to="/account"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Account
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
} 