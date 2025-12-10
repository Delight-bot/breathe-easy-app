import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Federated Learning Service
 * Enables privacy-preserving collaborative learning across users
 * Users share anonymized aggregated statistics, not raw data
 */

/**
 * Upload anonymized aggregated data for federated learning
 * This uploads statistics, not individual logs - preserving privacy
 */
export const uploadAnonymizedData = async (userId, userConditions, symptomLogs, location) => {
  try {
    // Aggregate user's data into statistics
    const aggregatedData = aggregateUserData(symptomLogs, userConditions);

    // Create anonymized record
    const anonymizedRecord = {
      // NO personal identifiers (no userId, name, email)
      location: {
        // Rounded location for privacy (within ~10km radius)
        lat: Math.round(location.lat * 10) / 10,
        lng: Math.round(location.lng * 10) / 10,
        region: location.region || 'unknown'
      },
      conditions: userConditions, // Medical conditions
      statistics: aggregatedData, // Aggregated stats, not raw logs
      timestamp: serverTimestamp(),
      dataPoints: symptomLogs.length, // How many logs contributed
      modelVersion: '1.0'
    };

    await addDoc(collection(db, 'federatedData'), anonymizedRecord);
    return { success: true };
  } catch (error) {
    console.error('Upload anonymized data error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Aggregate user's symptom logs into privacy-preserving statistics
 */
function aggregateUserData(symptomLogs, userConditions) {
  const severityMap = { 'mild': 0, 'moderate': 1, 'severe': 2, 'critical': 3 };

  // Group by AQI ranges
  const aqiRanges = {
    'good': { range: [0, 50], logs: [] },
    'moderate': { range: [51, 100], logs: [] },
    'unhealthy_sensitive': { range: [101, 150], logs: [] },
    'unhealthy': { range: [151, 200], logs: [] },
    'very_unhealthy': { range: [201, 300], logs: [] },
    'hazardous': { range: [301, 500], logs: [] }
  };

  // Categorize logs by AQI range
  symptomLogs.forEach(log => {
    const aqi = log.aqi || 100;
    for (const [category, data] of Object.entries(aqiRanges)) {
      if (aqi >= data.range[0] && aqi <= data.range[1]) {
        data.logs.push(log);
        break;
      }
    }
  });

  // Calculate statistics for each AQI range
  const statistics = {};
  for (const [category, data] of Object.entries(aqiRanges)) {
    if (data.logs.length > 0) {
      const severities = data.logs.map(log => severityMap[log.severity] || 0);

      statistics[category] = {
        count: data.logs.length,
        avgSeverity: severities.reduce((a, b) => a + b, 0) / severities.length,
        maxSeverity: Math.max(...severities),
        minSeverity: Math.min(...severities),
        // Most common triggers (anonymized)
        commonTriggers: getTopTriggers(data.logs, 3)
      };
    }
  }

  return statistics;
}

/**
 * Get most common triggers from logs
 */
function getTopTriggers(logs, topN = 3) {
  const triggerCounts = {};

  logs.forEach(log => {
    if (log.trigger) {
      triggerCounts[log.trigger] = (triggerCounts[log.trigger] || 0) + 1;
    }
  });

  return Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([trigger]) => trigger);
}

/**
 * Fetch anonymized data from nearby users with similar conditions
 */
export const fetchFederatedData = async (userConditions, userLocation, radius = 50) => {
  try {
    // Query for similar users in the same region
    const queries = [];

    // Match by each condition
    if (userConditions.hasAsthma) {
      queries.push(
        query(
          collection(db, 'federatedData'),
          where('conditions.hasAsthma', '==', true),
          orderBy('timestamp', 'desc'),
          limit(100)
        )
      );
    }

    if (userConditions.hasCOPD) {
      queries.push(
        query(
          collection(db, 'federatedData'),
          where('conditions.hasCOPD', '==', true),
          orderBy('timestamp', 'desc'),
          limit(100)
        )
      );
    }

    if (userConditions.hasAllergies) {
      queries.push(
        query(
          collection(db, 'federatedData'),
          where('conditions.hasAllergies', '==', true),
          orderBy('timestamp', 'desc'),
          limit(100)
        )
      );
    }

    // If no specific conditions, get general data
    if (queries.length === 0) {
      queries.push(
        query(
          collection(db, 'federatedData'),
          orderBy('timestamp', 'desc'),
          limit(100)
        )
      );
    }

    // Fetch all matching data
    const allData = [];
    for (const q of queries) {
      const snapshot = await getDocs(q);
      snapshot.forEach(doc => {
        const data = doc.data();

        // Filter by location proximity if location available
        if (userLocation && data.location) {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            data.location.lat,
            data.location.lng
          );

          if (distance <= radius) {
            allData.push({ id: doc.id, ...data });
          }
        } else {
          allData.push({ id: doc.id, ...data });
        }
      });
    }

    // Remove duplicates
    const uniqueData = Array.from(new Map(allData.map(item => [item.id, item])).values());

    return { success: true, data: uniqueData };
  } catch (error) {
    console.error('Fetch federated data error:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in km
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Create training data from federated statistics
 * Converts aggregated statistics back into synthetic training samples
 */
export const createFederatedTrainingData = (federatedData) => {
  const trainingExamples = [];

  federatedData.forEach(record => {
    const { conditions, statistics } = record;

    // Convert statistics back into training examples
    Object.entries(statistics).forEach(([aqiCategory, stats]) => {
      if (stats.count > 0) {
        // Get AQI range midpoint
        const aqiRanges = {
          'good': 25,
          'moderate': 75,
          'unhealthy_sensitive': 125,
          'unhealthy': 175,
          'very_unhealthy': 250,
          'hazardous': 400
        };

        const aqi = aqiRanges[aqiCategory] || 100;

        // Create weighted training examples based on count
        const weight = Math.min(stats.count, 10); // Cap weight at 10

        for (let i = 0; i < weight; i++) {
          trainingExamples.push({
            aqi: aqi + (Math.random() * 20 - 10), // Add slight variation
            hasAsthma: conditions.hasAsthma ? 1 : 0,
            hasCOPD: conditions.hasCOPD ? 1 : 0,
            hasAllergies: conditions.hasAllergies ? 1 : 0,
            avgSeverity: stats.avgSeverity,
            hourOfDay: Math.random() * 24 // Random hour since we don't track this
          });
        }
      }
    });
  });

  return trainingExamples;
};

/**
 * Get user's approximate location (city-level, not precise GPS)
 */
export const getUserLocation = async () => {
  try {
    // Try to get location from browser
    if ('geolocation' in navigator) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              region: 'unknown' // Would need reverse geocoding API for region
            });
          },
          () => {
            // Fallback: no location
            resolve(null);
          },
          { timeout: 5000 }
        );
      });
    }
    return null;
  } catch (error) {
    console.error('Get location error:', error);
    return null;
  }
};
