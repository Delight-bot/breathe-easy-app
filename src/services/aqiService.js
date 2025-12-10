// AQI API Service - Integrates multiple AQI data sources
// For production, store API keys in environment variables

const API_KEYS = {
  // Get free API keys from:
  // OpenWeatherMap: https://openweathermap.org/api
  // WAQI: https://aqicn.org/data-platform/token/
  // AirNow: https://docs.airnowapi.org/
  openweather: import.meta.env.VITE_OPENWEATHER_API_KEY || 'YOUR_OPENWEATHER_KEY',
  waqi: import.meta.env.VITE_WAQI_API_KEY || 'YOUR_WAQI_TOKEN',
  airnow: import.meta.env.VITE_AIRNOW_API_KEY || 'YOUR_AIRNOW_KEY'
};

/**
 * Get current location using browser geolocation API
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // Cache for 5 minutes
      }
    );
  });
};

/**
 * Fetch AQI data from OpenWeatherMap Air Pollution API
 */
export const getAQIFromOpenWeather = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEYS.openweather}`
    );

    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.list || data.list.length === 0) {
      throw new Error('No air quality data available');
    }

    const airData = data.list[0];

    // OpenWeatherMap uses 1-5 scale, convert to EPA AQI (0-500)
    const aqiScaleMap = {
      1: 50,   // Good
      2: 100,  // Fair
      3: 150,  // Moderate
      4: 200,  // Poor
      5: 300   // Very Poor
    };

    return {
      aqi: aqiScaleMap[airData.main.aqi] || 100,
      components: {
        co: airData.components.co,
        no2: airData.components.no2,
        o3: airData.components.o3,
        pm2_5: airData.components.pm2_5,
        pm10: airData.components.pm10,
        so2: airData.components.so2
      },
      timestamp: new Date(airData.dt * 1000),
      source: 'OpenWeatherMap'
    };
  } catch (error) {
    console.error('OpenWeatherMap API error:', error);
    throw error;
  }
};

/**
 * Fetch AQI data from WAQI (World Air Quality Index)
 */
export const getAQIFromWAQI = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${API_KEYS.waqi}`
    );

    if (!response.ok) {
      throw new Error(`WAQI API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error('WAQI API returned error status');
    }

    return {
      aqi: data.data.aqi,
      location: {
        name: data.data.city.name,
        coordinates: data.data.city.geo
      },
      components: {
        pm2_5: data.data.iaqi.pm25?.v,
        pm10: data.data.iaqi.pm10?.v,
        o3: data.data.iaqi.o3?.v,
        no2: data.data.iaqi.no2?.v,
        so2: data.data.iaqi.so2?.v,
        co: data.data.iaqi.co?.v
      },
      dominantPollutant: data.data.dominentpol,
      timestamp: new Date(data.data.time.iso),
      source: 'WAQI'
    };
  } catch (error) {
    console.error('WAQI API error:', error);
    throw error;
  }
};

/**
 * Fetch AQI data from EPA AirNow API (US only)
 */
export const getAQIFromAirNow = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=${lat}&longitude=${lon}&distance=25&API_KEY=${API_KEYS.airnow}`
    );

    if (!response.ok) {
      throw new Error(`AirNow API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error('No AirNow data available for this location');
    }

    // Find the highest AQI value from all pollutants
    const maxAQI = Math.max(...data.map(item => item.AQI));
    const primaryPollutant = data.find(item => item.AQI === maxAQI);

    return {
      aqi: maxAQI,
      category: primaryPollutant.Category.Name,
      location: {
        name: primaryPollutant.ReportingArea,
        state: primaryPollutant.StateCode
      },
      dominantPollutant: primaryPollutant.ParameterName,
      timestamp: new Date(primaryPollutant.DateObserved + 'T' + primaryPollutant.HourObserved + ':00:00'),
      source: 'AirNow (EPA)'
    };
  } catch (error) {
    console.error('AirNow API error:', error);
    throw error;
  }
};

/**
 * Get AQI data from city name
 */
export const getAQIByCity = async (cityName) => {
  try {
    const response = await fetch(
      `https://api.waqi.info/feed/${encodeURIComponent(cityName)}/?token=${API_KEYS.waqi}`
    );

    if (!response.ok) {
      throw new Error(`WAQI API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error('City not found or API error');
    }

    return {
      aqi: data.data.aqi,
      location: {
        name: data.data.city.name,
        coordinates: data.data.city.geo
      },
      components: {
        pm2_5: data.data.iaqi.pm25?.v,
        pm10: data.data.iaqi.pm10?.v,
        o3: data.data.iaqi.o3?.v,
        no2: data.data.iaqi.no2?.v,
        so2: data.data.iaqi.so2?.v,
        co: data.data.iaqi.co?.v
      },
      dominantPollutant: data.data.dominentpol,
      timestamp: new Date(data.data.time.iso),
      source: 'WAQI'
    };
  } catch (error) {
    console.error('Error fetching AQI by city:', error);
    throw error;
  }
};

/**
 * Main function to get AQI data with fallback support
 * Tries multiple APIs in order until one succeeds
 */
export const getAQIData = async (location = null) => {
  let coordinates;

  // Get location coordinates
  if (location && location.latitude && location.longitude) {
    coordinates = location;
  } else if (location && typeof location === 'string') {
    // City name provided
    try {
      return await getAQIByCity(location);
    } catch (error) {
      console.error('Failed to get AQI by city name:', error);
      throw new Error('Unable to fetch air quality data for this city');
    }
  } else {
    // Use current location
    try {
      coordinates = await getCurrentLocation();
    } catch (error) {
      console.error('Failed to get current location:', error);
      // Try to get location from localStorage (questionnaire data)
      const questionnaireData = JSON.parse(localStorage.getItem('questionnaireData') || '{}');
      if (questionnaireData.location) {
        return await getAQIByCity(questionnaireData.location);
      }
      throw new Error('Unable to determine location. Please enable location services or enter a city name.');
    }
  }

  // Try multiple APIs with fallback
  const apis = [
    { name: 'WAQI', fn: getAQIFromWAQI },
    { name: 'OpenWeatherMap', fn: getAQIFromOpenWeather },
    { name: 'AirNow', fn: getAQIFromAirNow }
  ];

  let lastError;

  for (const api of apis) {
    try {
      console.log(`Trying ${api.name} API...`);
      const data = await api.fn(coordinates.latitude, coordinates.longitude);
      console.log(`Successfully fetched AQI data from ${api.name}`);

      // Cache the result
      localStorage.setItem('lastAQIData', JSON.stringify({
        ...data,
        cachedAt: new Date().toISOString()
      }));

      return data;
    } catch (error) {
      console.warn(`${api.name} failed:`, error.message);
      lastError = error;
      continue;
    }
  }

  // All APIs failed, try to use cached data
  const cachedData = localStorage.getItem('lastAQIData');
  if (cachedData) {
    const parsed = JSON.parse(cachedData);
    const cacheAge = Date.now() - new Date(parsed.cachedAt).getTime();

    // Use cache if less than 30 minutes old
    if (cacheAge < 1800000) {
      console.log('Using cached AQI data');
      return parsed;
    }
  }

  // Everything failed
  throw new Error(`All AQI APIs failed. Last error: ${lastError?.message}`);
};

/**
 * Get AQI forecast (if available)
 */
export const getAQIForecast = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${API_KEYS.waqi}`
    );

    if (!response.ok) {
      throw new Error('Forecast API error');
    }

    const data = await response.json();

    if (data.status !== 'ok' || !data.data.forecast) {
      return null;
    }

    return {
      daily: data.data.forecast.daily
    };
  } catch (error) {
    console.error('Error fetching forecast:', error);
    return null;
  }
};

/**
 * Search for cities/locations
 */
export const searchLocations = async (query) => {
  try {
    const response = await fetch(
      `https://api.waqi.info/search/?token=${API_KEYS.waqi}&keyword=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error('Search API error');
    }

    const data = await response.json();

    if (data.status !== 'ok') {
      return [];
    }

    return data.data.map(station => ({
      name: station.station.name,
      coordinates: station.station.geo,
      aqi: station.aqi,
      time: station.time
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};
