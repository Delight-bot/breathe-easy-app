import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MedicalResources() {
  const navigate = useNavigate();

  const resources = [
    {
      title: 'Contact Respiratory Resources',
      description: 'Connect with respiratory specialists',
      icon: '💬',
      link: '/doctor'
    },
    {
      title: 'Inhaler Tracker',
      description: 'Monitor your inhaler usage',
      icon: '💊',
      link: '/connect-device'
    },
    {
      title: 'Respiratory Health Dashboard',
      description: 'View your complete health metrics',
      icon: '📊',
      link: '/condition-predictor'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg shadow-xl p-8" style={{background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'}}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Connect With Medical Resources</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Doctors Illustration */}
          <div className="flex justify-center mb-8">
            <div className="text-center">
              <img src="/images/breath4.jpeg" alt="Medical Care" className="w-64 h-48 object-cover rounded-lg shadow-lg mb-4" />
              <p className="text-gray-600">What can we do for you?</p>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <button
                key={index}
                onClick={() => navigate(resource.link)}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white p-5 rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center gap-4"
              >
                <span className="text-3xl">{resource.icon}</span>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-lg">{resource.title}</h3>
                  <p className="text-blue-100 text-sm">{resource.description}</p>
                </div>
                <span className="text-2xl">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
