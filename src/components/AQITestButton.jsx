import React, { useState } from 'react';

// Temporary testing component to trigger full-screen alert
function AQITestButton({ onTriggerAlert }) {
  const [isMinimized, setIsMinimized] = useState(false);

  const testLevels = [
    { label: 'Good (50)', aqi: 50 },
    { label: 'Moderate (100)', aqi: 100 },
    { label: 'Unhealthy for Sensitive (140)', aqi: 140 },
    { label: 'Unhealthy (165)', aqi: 165 },
    { label: 'Very Unhealthy (250)', aqi: 250 },
    { label: 'Hazardous (350)', aqi: 350 }
  ];

  return (
    <div className="fixed bottom-6 left-6 bg-black rounded-lg shadow-xl z-50 border-2 border-gray-700">
      <div
        className="flex justify-between items-center p-3 bg-orange-500 rounded-t-lg cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setIsMinimized(!isMinimized);
        }}
      >
        <h3 className="font-bold text-white text-sm">Test AQI Alerts</h3>
        <button
          className="text-white font-bold text-lg hover:bg-orange-600 px-2 rounded"
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(!isMinimized);
          }}
        >
          {isMinimized ? '▲' : '▼'}
        </button>
      </div>
      {!isMinimized && (
        <div className="p-4 space-y-2">
          {testLevels.map(level => (
            <button
              key={level.aqi}
              onClick={() => onTriggerAlert(level.aqi)}
              className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-orange-500 text-gray-200 hover:text-white rounded text-xs font-medium transition border border-gray-700"
            >
              {level.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AQITestButton;
