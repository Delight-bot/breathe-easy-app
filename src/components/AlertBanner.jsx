import React, { useState, useEffect } from 'react';
import { getAQIData } from '../services/aqiService';
import { getAQILevel, getRecommendations } from '../utils/aqiUtils';

export default function AlertBanner() {
  const [aqi, setAqi] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [userConditions, setUserConditions] = useState({});

  useEffect(() => {
    // Load user conditions
    const questionnaireData = JSON.parse(localStorage.getItem('questionnaireData') || '{}');
    setUserConditions({
      hasAsthma: questionnaireData.hasAsthma === 'yes',
      hasCOPD: questionnaireData.hasCOPD === 'yes',
      hasAllergies: questionnaireData.hasAllergies === 'yes'
    });

    // Fetch AQI data
    const fetchAQI = async () => {
      try {
        const data = await getAQIData();
        setAqi(data.aqi);
      } catch (error) {
        console.error('Failed to fetch AQI for banner:', error);
      }
    };

    fetchAQI();

    // Refresh every 15 minutes
    const interval = setInterval(fetchAQI, 900000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (aqi === null) return;

    // Determine if banner should be shown based on AQI and user conditions
    const level = getAQILevel(aqi);

    // Always show for unhealthy and above
    if (aqi > 150) {
      setShowBanner(true);
      return;
    }

    // Show for moderate-unhealthy if user has conditions
    if (aqi > 100 && (userConditions.hasAsthma || userConditions.hasCOPD || userConditions.hasAllergies)) {
      setShowBanner(true);
      return;
    }

    // Show for moderate if user has severe conditions
    if (aqi > 50 && (userConditions.hasAsthma || userConditions.hasCOPD)) {
      setShowBanner(true);
      return;
    }

    setShowBanner(false);
  }, [aqi, userConditions]);

  if (!showBanner || aqi === null) {
    return null;
  }

  const level = getAQILevel(aqi);
  const recommendations = getRecommendations(aqi, userConditions);

  const getBannerStyle = () => {
    if (aqi >= 200) return 'bg-blue-100 border-blue-600 text-blue-900';
    if (aqi >= 150) return 'bg-blue-100 border-blue-500 text-blue-900';
    if (aqi >= 100) return 'bg-blue-50 border-blue-400 text-blue-800';
    return 'bg-blue-50 border-blue-300 text-blue-700';
  };

  return (
    <div className={`${getBannerStyle()} border px-4 py-3 rounded-lg mb-4 shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">
              {level.label} Air Quality (AQI: {Math.round(aqi)})
            </h3>
            <button
              onClick={() => setShowBanner(false)}
              className="text-sm opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>

          {recommendations.general.length > 0 && (
            <p className="mb-2">{recommendations.general[0]}</p>
          )}

          {recommendations.protective.length > 0 && (
            <div className="mt-2 text-sm">
              <strong>Recommendations:</strong>
              <ul className="list-disc list-inside ml-2 mt-1">
                {recommendations.protective.slice(0, 2).map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {recommendations.medical.length > 0 && (
            <div className="mt-2 text-sm bg-white bg-opacity-50 p-2 rounded">
              <strong>For your condition:</strong>
              <ul className="list-disc list-inside ml-2 mt-1">
                {recommendations.medical.slice(0, 2).map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 