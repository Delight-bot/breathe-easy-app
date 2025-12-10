import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';

function QuestionnaireStep1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    hasAsthma: '',
    hasCOPD: '',
    hasAllergies: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store data in localStorage for now
    const existingData = JSON.parse(localStorage.getItem('questionnaireData') || '{}');
    localStorage.setItem('questionnaireData', JSON.stringify({
      ...existingData,
      ...formData
    }));
    navigate('/questionnaire/step2');
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
        <ProgressBar currentStep={1} totalSteps={3} />

        <h2 className="text-3xl font-bold text-green-900 mb-2">Medical History</h2>
        <p className="text-gray-600 mb-6">Help us understand your respiratory health</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="1"
              max="120"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              placeholder="Enter your age"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Do you have asthma?
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasAsthma"
                  value="yes"
                  checked={formData.hasAsthma === 'yes'}
                  onChange={handleChange}
                  required
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasAsthma"
                  value="no"
                  checked={formData.hasAsthma === 'no'}
                  onChange={handleChange}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">No</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Do you have COPD (Chronic Obstructive Pulmonary Disease)?
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasCOPD"
                  value="yes"
                  checked={formData.hasCOPD === 'yes'}
                  onChange={handleChange}
                  required
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasCOPD"
                  value="no"
                  checked={formData.hasCOPD === 'no'}
                  onChange={handleChange}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">No</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Do you have respiratory allergies?
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasAllergies"
                  value="yes"
                  checked={formData.hasAllergies === 'yes'}
                  onChange={handleChange}
                  required
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasAllergies"
                  value="no"
                  checked={formData.hasAllergies === 'no'}
                  onChange={handleChange}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">No</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
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

export default QuestionnaireStep1;
