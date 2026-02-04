import React, { useState } from 'react';

export default function TravelMap({ isOpen, onClose }) {
  const [selectedRoute, setSelectedRoute] = useState(null);

  const routes = [
    { id: 1, name: 'Golden Gate Park', distance: '2.5 mi', aqi: 28, quality: 'Excellent', color: 'primary' },
    { id: 2, name: 'Downtown', distance: '1.8 mi', aqi: 52, quality: 'Moderate', color: 'yellow' },
    { id: 3, name: 'Marina District', distance: '3.2 mi', aqi: 35, quality: 'Good', color: 'primary' },
    { id: 4, name: 'Mission Bay', distance: '2.1 mi', aqi: 45, quality: 'Good', color: 'primary' },
  ];

  if (!isOpen) return null;

  const getRouteColor = (quality) => {
    if (quality === 'Excellent') return 'bg-primary/20 border-primary text-primary';
    if (quality === 'Good') return 'bg-primary/15 border-primary text-primary';
    if (quality === 'Moderate') return 'bg-yellow-100 border-yellow-500 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-600 dark:text-yellow-400';
    return 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-600 dark:text-red-400';
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      ></div>
      <div className="fixed inset-4 md:inset-8 lg:inset-16 bg-white dark:bg-[#1A2E22] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-primary p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-text-primary dark:text-background-dark">map</span>
            <div>
              <h2 className="text-2xl font-bold text-text-primary dark:text-background-dark">Travel Plan</h2>
              <p className="text-sm opacity-90 text-text-primary dark:text-background-dark">Find clean air routes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white dark:bg-background-dark rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-text-primary">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Map Area */}
          <div className="flex-1 relative bg-gradient-to-br from-green-50 via-blue-50 to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
            {/* Simulated map with location markers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Decorative elements to simulate map */}
                <div className="absolute top-1/4 left-1/4 w-24 h-24 rounded-full bg-primary/20 blur-2xl"></div>
                <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-green-200/30 blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/2 w-28 h-28 rounded-full bg-primary/15 blur-2xl"></div>

                {/* Center content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8 bg-white/80 dark:bg-[#1A2E22]/80 backdrop-blur-sm rounded-2xl shadow-lg">
                    <span className="material-symbols-outlined text-6xl text-primary mb-4 block animate-pulse">explore</span>
                    <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">Air Quality Map</h3>
                    <p className="text-text-secondary max-w-md text-sm">
                      View air quality levels across different routes in your area. Green areas indicate the cleanest air for outdoor activities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map overlay indicators */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <div className="bg-white/95 dark:bg-[#1A2E22]/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs font-medium text-text-primary dark:text-white">Excellent</span>
              </div>
              <div className="bg-white/95 dark:bg-[#1A2E22]/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs font-medium text-text-primary dark:text-white">Moderate</span>
              </div>
              <div className="bg-white/95 dark:bg-[#1A2E22]/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs font-medium text-text-primary dark:text-white">Unhealthy</span>
              </div>
            </div>

            {/* Current location marker */}
            <div className="absolute bottom-8 left-8 bg-white/95 dark:bg-[#1A2E22]/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-primary">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary animate-pulse text-2xl">my_location</span>
                <div>
                  <span className="text-sm font-bold text-text-primary dark:text-white block">You are here</span>
                  <span className="text-xs text-text-secondary">Air Quality: Excellent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Routes Panel */}
          <div className="w-full lg:w-96 bg-background-light dark:bg-background-dark p-4 overflow-y-auto">
            <h3 className="text-lg font-bold text-text-primary dark:text-white mb-4">Recommended Routes</h3>
            <div className="space-y-3">
              {routes.map((route) => (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedRoute === route.id
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A2E22] hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">route</span>
                      <h4 className="font-bold text-text-primary dark:text-white">{route.name}</h4>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${getRouteColor(route.quality)}`}>
                      AQI {route.aqi}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-text-secondary">
                      <span className="material-symbols-outlined text-sm">straighten</span>
                      <span>{route.distance}</span>
                    </div>
                    <span className="text-text-secondary">{route.quality} Air</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-primary/10 dark:bg-primary/20 rounded-xl border border-primary">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary mt-0.5">lightbulb</span>
                <div>
                  <h4 className="font-bold text-primary mb-1 text-sm">Travel Tip</h4>
                  <p className="text-xs text-text-secondary">
                    Choose routes with lower AQI values for healthier outdoor activities. Consider traveling during early morning hours when air quality is typically better.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
