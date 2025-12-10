import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarSelector from '../components/AvatarSelector';

function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: { type: 'emoji', value: '👤' }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const initialData = {
      name: userData.name || '',
      email: userData.email || '',
      avatar: userData.avatar || { type: 'emoji', value: '👤' }
    };
    setFormData(initialData);
    setOriginalData(initialData);
  }, []);

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

  const handleSave = (e) => {
    e.preventDefault();

    localStorage.setItem('userData', JSON.stringify(formData));
    setOriginalData(formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-lg shadow-xl p-8" style={{background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'}}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <AvatarSelector
              selectedAvatar={formData.avatar.value}
              onAvatarChange={handleAvatarChange}
              disabled={!isEditing}
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
                disabled={!isEditing}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none transition disabled:bg-gray-200 disabled:cursor-not-allowed"
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
                disabled={!isEditing}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none transition disabled:bg-gray-200 disabled:cursor-not-allowed"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex gap-3 pt-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200 shadow-md hover:shadow-lg"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200 shadow-md hover:shadow-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition duration-200 shadow-md hover:shadow-lg"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
