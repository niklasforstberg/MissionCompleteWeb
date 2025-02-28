import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
      });
      
      const { token } = response.data;
      localStorage.setItem('jwt', token);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-beige to-forest-green/10">
      <div className="bg-white p-10 rounded-xl shadow-lg w-96 space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-forest-green rounded-full flex items-center justify-center">
            <span className="text-2xl text-white">MC</span>
          </div>
          <h1 className="text-3xl font-bold text-forest-green">Mission Complete</h1>
          <p className="text-charcoal/60 mt-2">Welcome back! Please sign in.</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded">
            <p className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-charcoal font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-charcoal font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent transition-all"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-forest-green text-white py-3 px-4 rounded-lg hover:bg-forest-green/90 transition-all font-medium shadow-sm hover:shadow-md"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-sm text-charcoal/60">
          Don't have an account?{' '}
          <a href="/signup" className="text-forest-green hover:underline font-medium">
            Create one
          </a>
        </div>
      </div>
    </div>
  );
} 