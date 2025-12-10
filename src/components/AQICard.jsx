import React, { useState, useEffect } from 'react';
import { getAQIData } from '../services/aqiService';
import { getAQILevel } from '../utils/aqiUtils';

export default function AQICard() {
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [aqiComponents, setAqiComponents] = useState(null);

  // Fetch AQI data
  const fetchAQI = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAQIData();
      setAqi(data.aqi);
      setLocation(data.location?.name || 'Current Location');
      setAqiComponents(data.components);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch AQI:', err);
      setError(err.message);
      setLoading(false);
      // Use mock data as fallback
      setAqi(142);
      setLocation('Demo Location');
      setLastUpdate(new Date());
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAQI();

    // Refresh every 15 minutes
    const interval = setInterval(() => {
      fetchAQI();
    }, 900000); // 15 minutes

    return () => clearInterval(interval);
  }, []);

  if (loading && aqi === null) {
    return (
      <div className="p-6 rounded-lg shadow-md text-center mb-6" style={{background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'}}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Current AQI</h2>
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
        </div>
        <p className="text-sm text-gray-500 mt-4">Loading air quality data...</p>
      </div>
    );
  }

  const level = aqi ? getAQILevel(aqi) : null;
  const getAQIColor = (aqiValue) => {
    if (aqiValue >= 200) return "text-black";
    if (aqiValue >= 150) return "text-black";
    if (aqiValue >= 100) return "text-black";
    if (aqiValue >= 50) return "text-black";
    return "text-black";
  };
  const color = aqi ? getAQIColor(aqi) : "text-gray-500";

  return (
    <div className="p-6 rounded-lg shadow-md text-center mb-6 bg-black border border-white border-opacity-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">Current AQI</h2>
        <button
          onClick={fetchAQI}
          className="text-base text-white hover:text-gray-300 font-medium"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <p className="text-7xl font-bold text-white mb-2">
        {aqi || '--'}
      </p>
      <p className="text-xl text-gray-300 mb-1">{level?.label || 'Unknown'}</p>

      {location && (
        <p className="text-base text-gray-400 mb-4">
          {location}
        </p>
      )}

      {lastUpdate && (
        <p className="text-sm text-gray-500 mb-4">
          Last updated: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}

      <div className="w-full bg-white bg-opacity-20 rounded-full h-2.5 mb-2">
        <div
          className="bg-white h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(((aqi || 0) / 500) * 100, 100)}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm text-gray-400 mt-1 mb-6">
        <span>0</span>
        <span>50</span>
        <span>100</span>
        <span>150</span>
        <span>200</span>
        <span>300+</span>
      </div>

      {/* Air Quality Components */}
      {aqiComponents && (
        <div className="border-t border-white border-opacity-20 pt-4">
          <h3 className="text-base font-semibold text-white mb-3">Air Quality Components</h3>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {aqiComponents.pm2_5 && (
              <div className="bg-white bg-opacity-10 p-2 rounded border border-white border-opacity-20">
                <div className="text-gray-400">PM2.5</div>
                <div className="font-semibold text-white">{Math.round(aqiComponents.pm2_5)}</div>
              </div>
            )}
            {aqiComponents.pm10 && (
              <div className="bg-white bg-opacity-10 p-2 rounded border border-white border-opacity-20">
                <div className="text-gray-400">PM10</div>
                <div className="font-semibold text-white">{Math.round(aqiComponents.pm10)}</div>
              </div>
            )}
            {aqiComponents.o3 && (
              <div className="bg-white bg-opacity-10 p-2 rounded border border-white border-opacity-20">
                <div className="text-gray-400">O₃</div>
                <div className="font-semibold text-white">{Math.round(aqiComponents.o3)}</div>
              </div>
            )}
            {aqiComponents.no2 && (
              <div className="bg-white bg-opacity-10 p-2 rounded border border-white border-opacity-20">
                <div className="text-gray-400">NO₂</div>
                <div className="font-semibold text-white">{Math.round(aqiComponents.no2)}</div>
              </div>
            )}
            {aqiComponents.so2 && (
              <div className="bg-white bg-opacity-10 p-2 rounded border border-white border-opacity-20">
                <div className="text-gray-400">SO₂</div>
                <div className="font-semibold text-white">{Math.round(aqiComponents.so2)}</div>
              </div>
            )}
            {aqiComponents.co && (
              <div className="bg-white bg-opacity-10 p-2 rounded border border-white border-opacity-20">
                <div className="text-gray-400">CO</div>
                <div className="font-semibold text-white">{Math.round(aqiComponents.co)}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}