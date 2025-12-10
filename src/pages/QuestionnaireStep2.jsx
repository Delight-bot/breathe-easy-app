import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';

function QuestionnaireStep2() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: '',
    smoker: '',
    exercise: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store data in localStorage
    const existingData = JSON.parse(localStorage.getItem('questionnaireData') || '{}');
    localStorage.setItem('questionnaireData', JSON.stringify({
      ...existingData,
      ...formData
    }));
    navigate('/questionnaire/step3');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <ProgressBar currentStep={2} totalSteps={3} />

        <h2 className="text-3xl font-bold text-green-900 mb-2">Lifestyle & Location</h2>
        <p className="text-gray-600 mb-6">Tell us about your environment and habits</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Where do you live? (City, State)
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              placeholder="e.g., Los Angeles, CA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Do you smoke or vape?
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="smoker"
                  value="yes"
                  checked={formData.smoker === 'yes'}
                  onChange={handleChange}
                  required
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">Yes, currently</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="smoker"
                  value="former"
                  checked={formData.smoker === 'former'}
                  onChange={handleChange}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">Former smoker</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="smoker"
                  value="no"
                  checked={formData.smoker === 'no'}
                  onChange={handleChange}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">No, never</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How often do you exercise outdoors?
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="exercise"
                  value="daily"
                  checked={formData.exercise === 'daily'}
                  onChange={handleChange}
                  required
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">Daily</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="exercise"
                  value="weekly"
                  checked={formData.exercise === 'weekly'}
                  onChange={handleChange}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">Several times a week</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="exercise"
                  value="occasionally"
                  checked={formData.exercise === 'occasionally'}
                  onChange={handleChange}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">Occasionally</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="exercise"
                  value="rarely"
                  checked={formData.exercise === 'rarely'}
                  onChange={handleChange}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">Rarely or never</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate('/questionnaire/step1')}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-200 shadow-md hover:shadow-lg"
            >
              Next Step →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionnaireStep2;
