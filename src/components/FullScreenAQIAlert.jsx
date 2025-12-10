import React, { useState, useEffect } from 'react';
import { getAQILevel, getRecommendations, getRouteAQIAdvice, estimateSaferRoute } from '../utils/aqiUtils';

function FullScreenAQIAlert({ aqi, onDismiss, userConditions }) {
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const level = getAQILevel(aqi);
  const recommendations = getRecommendations(aqi, userConditions);

  useEffect(() => {
    // Play alert sound/vibration
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    // Request notification permission if not granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handlePlanRoute = () => {
    if (!destination.trim()) {
      alert('Please enter a destination');
      return;
    }

    setIsCalculating(true);

    // Simulate route calculation (in production, this would call a real API)
    setTimeout(() => {
      const mockRoutes = [
        {
          id: 1,
          name: 'Main Highway Route',
          distance: '12.5 mi',
          duration: '25 min',
          description: 'Fastest route via I-95'
        },
        {
          id: 2,
          name: 'Coastal Route',
          distance: '14.8 mi',
          duration: '32 min',
          description: 'Scenic route along the coast'
        },
        {
          id: 3,
          name: 'Park Route',
          distance: '13.2 mi',
          duration: '28 min',
          description: 'Through residential areas and parks'
        }
      ];

      const routesWithAQI = estimateSaferRoute(mockRoutes, { current: aqi });
      setRoutes(routesWithAQI);
      setIsCalculating(false);
    }, 1500);
  };

  const getBackgroundColor = () => {
    if (aqi >= 200) return 'bg-blue-900';
    if (aqi >= 150) return 'bg-blue-800';
    if (aqi >= 100) return 'bg-blue-700';
    return 'bg-blue-600';
  };

  const getTextSizeClass = () => {
    if (aqi >= 200) return 'text-8xl';
    if (aqi >= 150) return 'text-7xl';
    return 'text-6xl';
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto relative" style={{
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/Breath2.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="min-h-screen p-6 text-white pb-20 relative z-10">
        {/* Header with Dismiss */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">AIR QUALITY ALERT</h1>
            <p className="text-lg opacity-90">{level.label}</p>
          </div>
          <button
            onClick={onDismiss}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition"
          >
            Dismiss
          </button>
        </div>

        {/* Main AQI Display */}
        <div className="text-center mb-12">
          <div className={`${getTextSizeClass()} font-bold mb-4 animate-pulse`}>
            {Math.round(aqi)}
          </div>
          <div className="text-3xl font-semibold mb-2">
            Current Air Quality Index
          </div>
          <div className="text-xl opacity-90">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* General Recommendations */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
            <h3 className="text-2xl font-bold mb-4">
              What You Should Know
            </h3>
            <ul className="space-y-3">
              {recommendations.general.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-2xl">•</span>
                  <span className="text-lg">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Protective Measures */}
          {recommendations.protective.length > 0 && (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <h3 className="text-2xl font-bold mb-4">
                Protective Measures
              </h3>
              <ul className="space-y-3">
                {recommendations.protective.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span className="text-lg">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Medical Recommendations */}
          {recommendations.medical.length > 0 && (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <h3 className="text-2xl font-bold mb-4">
                Medical Guidance
              </h3>
              <ul className="space-y-3">
                {recommendations.medical.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-2xl">+</span>
                    <span className="text-lg">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Activity Recommendations */}
          {recommendations.activity.length > 0 && (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <h3 className="text-2xl font-bold mb-4">
                Activity Guidance
              </h3>
              <ul className="space-y-3">
                {recommendations.activity.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-2xl">!</span>
                    <span className="text-lg">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Route Planning Section */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
          <h3 className="text-2xl font-bold mb-4">
            Planning to Travel?
          </h3>

          {!showRouteOptions ? (
            <div className="text-center py-6">
              <p className="text-lg mb-6">
                Get route suggestions with better air quality for your journey
              </p>
              <button
                onClick={() => setShowRouteOptions(true)}
                className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition shadow-lg"
              >
                Find Safer Route
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter your destination..."
                  className="flex-1 px-6 py-4 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 placeholder-white placeholder-opacity-60 text-white text-lg focus:outline-none focus:ring-2 focus:ring-white"
                  onKeyPress={(e) => e.key === 'Enter' && handlePlanRoute()}
                />
                <button
                  onClick={handlePlanRoute}
                  disabled={isCalculating}
                  className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition disabled:opacity-50"
                >
                  {isCalculating ? 'Calculating...' : 'Find Routes'}
                </button>
              </div>

              {/* Route Results */}
              {routes.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-xl font-semibold mb-3">Recommended Routes (sorted by air quality):</h4>
                  {routes.map((route, idx) => (
                    <div
                      key={route.id}
                      className={`bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-4 border-2 ${
                        idx === 0 ? 'border-white border-opacity-60' : 'border-white border-opacity-20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {idx === 0 && <span className="text-lg font-bold">BEST</span>}
                            <h5 className="text-lg font-bold">{route.name}</h5>
                          </div>
                          <p className="text-sm opacity-90">{route.description}</p>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span>{route.distance}</span>
                            <span>{route.duration}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">{route.avgAQI}</div>
                          <div className="text-sm opacity-90">{route.aqiLevel.label}</div>
                          <div className="text-xs mt-1">
                            Health Score: {route.healthScore}/10
                          </div>
                        </div>
                      </div>
                      {idx === 0 && (
                        <div className="mt-3 pt-3 border-t border-white border-opacity-20">
                          <span className="text-sm font-semibold">Best air quality route</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Emergency Contact */}
        {aqi >= 200 && (
          <div className="mt-8 bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-6 border-2 border-white border-opacity-40">
            <h3 className="text-2xl font-bold mb-3">
              Emergency Information
            </h3>
            <p className="text-lg mb-4">
              If you experience severe breathing difficulties, chest pain, or other serious symptoms:
            </p>
            <button className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-xl hover:bg-opacity-90 transition shadow-lg">
              Call 911
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <button
            onClick={onDismiss}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-8 py-4 rounded-xl font-bold text-lg transition border-2 border-white border-opacity-40"
          >
            I Understand - Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

export default FullScreenAQIAlert;
