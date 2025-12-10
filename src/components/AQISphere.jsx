import React, { useState, useEffect } from 'react';
import { getAQIData } from '../services/aqiService';
import { getAQILevel } from '../utils/aqiUtils';

export default function AQISphere() {
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [location, setLocation] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchAQI = async () => {
    try {
      setLoading(true);
      const data = await getAQIData();
      setAqi(data.aqi);
      setLocation(data.location?.name || 'Current Location');
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch AQI:', err);
      setLoading(false);
      // Use mock data as fallback
      setAqi(142);
      setLocation('Demo Location');
      setLastUpdate(new Date());
    }
  };

  useEffect(() => {
    fetchAQI();
    const interval = setInterval(() => {
      fetchAQI();
    }, 900000); // 15 minutes

    return () => clearInterval(interval);
  }, []);

  const level = aqi ? getAQILevel(aqi) : null;

  const getAQIColor = (aqiValue) => {
    if (aqiValue >= 300) return { bg: '#5a0018', glow: '#7e0023' }; // Darker Maroon
    if (aqiValue >= 200) return { bg: '#6b0036', glow: '#99004c' }; // Darker Purple
    if (aqiValue >= 150) return { bg: '#b30000', glow: '#ff0000' }; // Darker Red
    if (aqiValue >= 100) return { bg: '#cc5500', glow: '#ff7e00' }; // Darker Orange
    if (aqiValue >= 50) return { bg: '#cccc00', glow: '#ffff00' }; // Darker Yellow
    return { bg: '#00aa00', glow: '#00e400' }; // Darker Green
  };

  const colors = aqi ? getAQIColor(aqi) : { bg: '#6b7280', glow: '#6b7280' };

  return (
    <div
      className="inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Pulsating Sphere */}
      <div className="relative cursor-pointer">
        {/* Outer pulsating ring */}
        <div
          className="absolute inset-0 rounded-full animate-pulse-slow opacity-50"
          style={{
            backgroundColor: colors.glow,
            width: '100px',
            height: '100px',
          }}
        />

        {/* Main sphere */}
        <div
          className="relative flex flex-col items-center justify-center rounded-full shadow-2xl border-4 border-gray-600 border-opacity-50 transition-transform hover:scale-110"
          style={{
            backgroundColor: colors.bg,
            width: '100px',
            height: '100px',
            boxShadow: `0 0 25px ${colors.glow}80, 0 0 50px ${colors.glow}30`,
          }}
        >
          {loading && aqi === null ? (
            <div className="text-white text-xs font-semibold">...</div>
          ) : (
            <>
              <div className="text-white text-3xl font-bold leading-tight">
                {aqi || '--'}
              </div>
              <div className="text-white text-xs font-medium opacity-90">
                AQI
              </div>
            </>
          )}
        </div>

        {/* Tooltip */}
        {showTooltip && aqi && (
          <div
            className="absolute top-0 left-full ml-4 w-64 bg-gray-900 bg-opacity-95 border border-gray-700 rounded-lg shadow-2xl p-4 animate-fadeIn z-50"
            style={{ marginTop: '-20px' }}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-200">Air Quality</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fetchAQI();
                }}
                className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
              >
                Refresh
              </button>
            </div>

            <div className="mb-3">
              <div className="text-3xl font-bold text-gray-100 mb-1">{aqi}</div>
              <div className="text-sm font-semibold mb-1 opacity-80" style={{ color: colors.bg }}>
                {level?.label || 'Unknown'}
              </div>
              {location && (
                <div className="text-xs text-gray-500">{location}</div>
              )}
            </div>

            <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
              <div
                className="h-2 rounded-full transition-all duration-500 opacity-80"
                style={{
                  width: `${Math.min(((aqi || 0) / 500) * 100, 100)}%`,
                  backgroundColor: colors.bg
                }}
              ></div>
            </div>

            {level?.description && (
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                {level.description}
              </p>
            )}

            {lastUpdate && (
              <p className="text-xs text-gray-600 mt-2">
                Updated: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.3;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
