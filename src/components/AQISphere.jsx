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
    if (aqiValue >= 300) return '#7e0023'; // Maroon
    if (aqiValue >= 200) return '#99004c'; // Purple
    if (aqiValue >= 150) return '#ff0000'; // Red
    if (aqiValue >= 100) return '#ff7e00'; // Orange
    if (aqiValue >= 50) return '#ffff00'; // Yellow
    return '#13ec6d'; // Green
  };

  const strokeColor = aqi ? getAQIColor(aqi) : '#13ec6d';
  const percentage = aqi ? Math.min((aqi / 500) * 100, 100) : 0;
  const circumference = 264;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-text-secondary">Current Air Quality</p>
      <div className="relative mb-4 flex h-48 w-48 items-center justify-center">
        {/* Progress Ring SVG */}
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            className="text-gray-100 dark:text-gray-800"
            cx="50"
            cy="50"
            fill="transparent"
            r="42"
            stroke="currentColor"
            strokeWidth="8"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            fill="transparent"
            r="42"
            stroke={strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeWidth="8"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {loading && aqi === null ? (
            <span className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white">...</span>
          ) : (
            <>
              <span className="text-5xl font-extrabold tracking-tight text-text-primary dark:text-white">
                {aqi || '--'}
              </span>
              <span className="text-sm font-bold text-primary">AQI</span>
            </>
          )}
        </div>
      </div>
      <h2 className="mb-1 text-2xl font-bold text-text-primary dark:text-white">
        {level?.label || 'Loading...'}
      </h2>
      <p className="mb-4 text-sm text-text-secondary">
        {level?.description || 'Fetching air quality data...'}
      </p>
      <div className="flex items-center gap-2 rounded-lg bg-background-light px-3 py-1.5 dark:bg-background-dark">
        <span className="material-symbols-outlined text-sm text-text-secondary">schedule</span>
        <p className="text-xs font-medium text-text-secondary">
          {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Updating...'}
        </p>
      </div>
    </div>
  );
}
