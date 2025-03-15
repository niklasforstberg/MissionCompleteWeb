import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Account() {
  const navigate = useNavigate();
  const { user, isLoading, error } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Role</label>
            <p className="font-medium capitalize">{user.role.toLowerCase()}</p>
          </div>
          {user.createdAt && (
            <div>
              <label className="text-sm text-gray-600">Member Since</label>
              <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
} 