import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarSelector from '../components/AvatarSelector';
import { signUpUser } from '../services/authService';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: { type: 'emoji', value: '👤' }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }

    setLoading(true);

    // Sign up with Firebase
    const result = await signUpUser(formData.email, formData.password, {
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar
    });

    setLoading(false);

    if (result.success) {
      // Also save to localStorage for backward compatibility
      localStorage.setItem('userData', JSON.stringify({
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar
      }));

      console.log('Signup successful:', result.user);
      navigate('/questionnaire/step1');
    } else {
      setError(result.error || 'Signup failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (avatar) => {
    setFormData({
      ...formData,
      avatar: avatar
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4" style={{
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/images/Breath3.jpeg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="rounded-lg shadow-xl p-8 max-w-md w-full" style={{background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'}}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Breathe Easy</h1>
          <p className="text-gray-700">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <AvatarSelector
            selectedAvatar={formData.avatar.value}
            onAvatarChange={handleAvatarChange}
          />

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none transition"
              placeholder="John Doe"
            />
          </div>

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
              minLength="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-gray-900 font-semibold hover:text-gray-700 transition"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
