import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth';

export default function Welcome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      localStorage.setItem('jwt', token!);
      
      await authApi.setInitialPassword({
        token: token!,
        password,
      });
      
      navigate('/');
    } catch (err) {
      setError('Invalid or expired invitation link');
      localStorage.removeItem('jwt');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-off-white to-light-gray">
        <div className="bg-white p-10 rounded-xl shadow-lg w-96">
          <p className="text-center text-error-red">Invalid invitation link</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-off-white to-light-gray">
      <div className="bg-white p-10 rounded-xl shadow-lg w-96 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-rich-black">Welcome!</h1>
          <p className="text-medium-gray mt-2">Please set your password to continue</p>
        </div>

        {error && (
          <div className="bg-error-red/10 border-l-4 border-error-red text-error-red p-4 rounded">
            <p className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-rich-black font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-purple focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-rich-black font-medium mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-purple focus:border-transparent transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-vibrant-purple text-white py-3 px-4 rounded-lg hover:bg-vibrant-purple/90 transition-all font-medium shadow-sm hover:shadow-md"
          >
            Set Password & Continue
          </button>
        </form>
      </div>
    </div>
  );
} 