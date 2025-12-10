import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';

function QuestionnaireStep3() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    notifications: '',
    goals: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store final data
    const existingData = JSON.parse(localStorage.getItem('questionnaireData') || '{}');
    const completeData = {
      ...existingData,
      ...formData,
      completedAt: new Date().toISOString()
    };
    localStorage.setItem('questionnaireData', JSON.stringify(completeData));
    localStorage.setItem('questionnaireCompleted', 'true');

    // Navigate to main dashboard
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const goalOptions = [
    'Monitor air quality in my area',
    'Track my respiratory symptoms',
    'Reduce exposure to pollutants',
    'Get alerts for poor air quality days',
    'Learn about respiratory health'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <ProgressBar currentStep={3} totalSteps={3} />

        <h2 className="text-3xl font-bold text-green-900 mb-2">Preferences & Goals</h2>
        <p className="text-gray-600 mb-6">Let's customize your experience</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Would you like to receive air quality alerts?
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="notifications"
                  value="all"
                  checked={formData.notifications === 'all'}
                  onChange={handleChange}
                  required
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">Yes, all alerts</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="notifications"
                  value="important"
                  checked={formData.notifications === 'important'}
                  onChange={handleChange}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">Only important alerts (unhealthy air)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="notifications"
                  value="none"
                  checked={formData.notifications === 'none'}
                  onChange={handleChange}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">No alerts</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What are your main goals? (Select all that apply)
            </label>
            <div className="space-y-3">
              {goalOptions.map(goal => (
                <label key={goal} className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.goals.includes(goal)}
                    onChange={() => handleGoalToggle(goal)}
                    className="mt-1 mr-3 text-green-600 focus:ring-green-500 rounded"
                  />
                  <span className="text-gray-700">{goal}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-800">
              <strong>📋 Almost done!</strong> Once you complete this step, you'll have full access to your personalized air quality dashboard.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate('/questionnaire/step2')}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-200 shadow-md hover:shadow-lg"
            >
              Complete Setup ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionnaireStep3;
