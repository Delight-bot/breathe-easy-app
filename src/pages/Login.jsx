import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RunningAvatar from '../components/RunningAvatar';
import { signInUser, getUserData } from '../services/authService';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Sign in with Firebase
    const result = await signInUser(formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      // Fetch user data from Firestore
      const userData = await getUserData(result.user.uid);

      if (userData.success) {
        // Save to localStorage for backward compatibility
        localStorage.setItem('userData', JSON.stringify(userData.data));
      }

      console.log('Login successful:', result.user);
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4" style={{
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/images/breath7.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="rounded-lg shadow-xl p-8 max-w-md w-full" style={{background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'}}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Breathe Easy</h1>
          <p className="text-gray-700">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-gray-900 font-semibold hover:text-gray-700 transition"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Running Avatar Animation */}
      <RunningAvatar />
    </div>
  );
}

export default Login;
