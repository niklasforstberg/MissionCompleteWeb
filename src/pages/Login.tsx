import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';

export default function Login() {
  console.log('Rendering Login page');
  
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await authApi.login({ email, password: '' });
      setShowPassword(true);
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.requiresPasswordSet) {
        setIsSettingPassword(true);
        setShowPassword(true);
        setError('Please set your password to continue');
      } else {
        setError('Invalid email address');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSettingPassword) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        await authApi.setPassword({ password });
        const { token } = await authApi.login({ email, password });
        localStorage.setItem('jwt', token);
        navigate('/');
      } else {
        const { token } = await authApi.login({ email, password });
        localStorage.setItem('jwt', token);
        navigate('/');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-off-white to-light-gray">
      <div className="bg-white p-10 rounded-xl shadow-lg w-96 space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-vibrant-purple rounded-full flex items-center justify-center">
            <span className="text-2xl text-white">MC</span>
          </div>
          <h1 className="text-3xl font-bold text-rich-black">Mission Complete</h1>
          <p className="text-medium-gray mt-2">Welcome back! Please sign in.</p>
        </div>
        
        {error && (
          <div className="bg-error-red/10 border-l-4 border-error-red text-error-red p-4 rounded">
            <p className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </p>
          </div>
        )}
        
        <form onSubmit={showPassword ? handleSubmit : handleEmailSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-rich-black font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-purple focus:border-transparent transition-all"
              required
            />
          </div>
          
          {showPassword && (
            <>
              <div>
                <label htmlFor="password" className="block text-rich-black font-medium mb-2">
                  {isSettingPassword ? 'Set New Password' : 'Password'}
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

              {isSettingPassword && (
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
              )}
            </>
          )}
          
          <button
            type="submit"
            className="w-full bg-vibrant-purple text-white py-3 px-4 rounded-lg hover:bg-vibrant-purple/90 transition-all font-medium shadow-sm hover:shadow-md"
          >
            {!showPassword ? 'Next' : isSettingPassword ? 'Set Password & Sign In' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-sm text-medium-gray">
          Don't have an account?{' '}
          <a href="/signup" className="text-vibrant-purple hover:text-vibrant-purple/80 font-medium">
            Create one
          </a>
        </div>
      </div>
    </div>
  );
} 