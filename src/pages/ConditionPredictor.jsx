import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConditionPredictor() {
  const navigate = useNavigate();

  // Sample data for the graph
  const graphData = [
    { day: 'Mon', value: 30 },
    { day: 'Tue', value: 45 },
    { day: 'Wed', value: 35 },
    { day: 'Thu', value: 60 },
    { day: 'Fri', value: 50 },
    { day: 'Sat', value: 40 },
    { day: 'Sun', value: 55 }
  ];

  const maxValue = Math.max(...graphData.map(d => d.value));

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg shadow-xl p-8" style={{background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'}}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Condition Predictor</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Graph Container */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Respiratory Health Trends</h2>

            {/* Simple Bar Chart */}
            <div className="flex items-end justify-around h-64 gap-2 bg-white rounded-lg p-4">
              {graphData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-blue-600 rounded-t-lg transition-all hover:bg-blue-700"
                       style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '20px' }}>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 font-medium">{item.day}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Respiratory Chatbot */}
          <div className="bg-blue-600 rounded-xl p-6 mb-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                💬
              </div>
              <div>
                <h3 className="font-semibold text-lg">I have breathing issues</h3>
                <p className="text-blue-100 text-sm">Respiratory Chatbot</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/doctor')}
              className="bg-white hover:bg-gray-100 text-blue-600 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Start Chat
            </button>
          </div>

          {/* Important Insights */}
          <div className="bg-white rounded-xl border-2 border-blue-300 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                📋
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Important Insights</h3>
                <p className="text-gray-600 text-sm">Request important answers</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/exposure-impacts')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              View Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
