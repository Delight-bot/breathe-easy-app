import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ExposureImpacts() {
  const navigate = useNavigate();

  const mitigationTechniques = [
    {
      title: 'Stay Indoors',
      description: 'Avoid outdoor activities when AQI is high',
      impact: 'High',
      icon: '🏠'
    },
    {
      title: 'Use Air Purifier',
      description: 'Indoor air filtration can reduce exposure',
      impact: 'Medium',
      icon: '💨'
    },
    {
      title: 'Wear N95 Mask',
      description: 'Protects against particulate matter',
      impact: 'High',
      icon: '😷'
    },
    {
      title: 'Stay Hydrated',
      description: 'Helps body cope with air pollution',
      impact: 'Medium',
      icon: '💧'
    },
    {
      title: 'Monitor Symptoms',
      description: 'Track changes in respiratory health',
      impact: 'High',
      icon: '📊'
    },
    {
      title: 'Consult Doctor',
      description: 'Seek medical advice for persistent issues',
      impact: 'High',
      icon: '👨‍⚕️'
    }
  ];

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg shadow-xl p-8" style={{background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'}}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Exposure Impacts</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* AQI Status Banner */}
          <div className="bg-blue-600 rounded-xl p-6 mb-6 text-white relative overflow-hidden">
            <img src="/images/breath5.jpeg" alt="Air Quality" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h2 className="text-2xl font-bold mb-2">AQI: 135</h2>
                <p className="text-blue-100">Status: Unhealthy for Sensitive Groups</p>
              </div>
              <div className="text-6xl">🌫️</div>
            </div>
          </div>

          {/* Mitigation Techniques */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mitigation Techniques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mitigationTechniques.map((technique, index) => (
                <div key={index} className="bg-white border-2 border-blue-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{technique.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800 mb-1">{technique.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{technique.description}</p>
                      <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getImpactColor(technique.impact)}`}>
                        {technique.impact} Impact
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Resources */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-semibold text-lg text-gray-900 mb-3">Need More Help?</h3>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/doctor')}
                className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Contact Doctor
              </button>
              <button
                onClick={() => navigate('/medical-resources')}
                className="bg-white hover:bg-gray-100 text-blue-600 px-4 py-2 rounded-lg font-semibold transition-colors border border-blue-300"
              >
                View Resources
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
