// AQI levels and health recommendations
export const AQI_LEVELS = {
  GOOD: { min: 0, max: 50, color: 'green', label: 'Good', alertLevel: 'none' },
  MODERATE: { min: 51, max: 100, color: 'yellow', label: 'Moderate', alertLevel: 'low' },
  UNHEALTHY_SENSITIVE: { min: 101, max: 150, color: 'orange', label: 'Unhealthy for Sensitive Groups', alertLevel: 'medium' },
  UNHEALTHY: { min: 151, max: 200, color: 'red', label: 'Unhealthy', alertLevel: 'high' },
  VERY_UNHEALTHY: { min: 201, max: 300, color: 'purple', label: 'Very Unhealthy', alertLevel: 'critical' },
  HAZARDOUS: { min: 301, max: 500, color: 'maroon', label: 'Hazardous', alertLevel: 'emergency' }
};

export const getAQILevel = (aqi) => {
  for (const level of Object.values(AQI_LEVELS)) {
    if (aqi >= level.min && aqi <= level.max) {
      return level;
    }
  }
  return AQI_LEVELS.HAZARDOUS;
};

export const shouldShowFullScreenAlert = (aqi, userConditions) => {
  const level = getAQILevel(aqi);

  // Always show for very unhealthy and hazardous
  if (level.alertLevel === 'critical' || level.alertLevel === 'emergency') {
    return true;
  }

  // Show for unhealthy if user has respiratory conditions
  if (level.alertLevel === 'high' && (
    userConditions.hasAsthma ||
    userConditions.hasCOPD ||
    userConditions.hasAllergies
  )) {
    return true;
  }

  // Show for moderate-high if user has severe conditions
  if (level.alertLevel === 'medium' && (
    userConditions.hasAsthma ||
    userConditions.hasCOPD
  )) {
    return true;
  }

  return false;
};

export const getRecommendations = (aqi, userConditions, isOutdoorActivity = false) => {
  const level = getAQILevel(aqi);
  const recommendations = {
    general: [],
    protective: [],
    activity: [],
    medical: []
  };

  // General population recommendations
  if (aqi <= 50) {
    recommendations.general.push('Air quality is good. Enjoy outdoor activities!');
  } else if (aqi <= 100) {
    recommendations.general.push('Air quality is acceptable for most people.');
    if (userConditions.hasAsthma || userConditions.hasCOPD || userConditions.hasAllergies) {
      recommendations.general.push('People with respiratory conditions should monitor for symptoms.');
    }
  } else if (aqi <= 150) {
    recommendations.general.push('Sensitive groups should reduce prolonged outdoor exertion.');
    recommendations.protective.push('Consider wearing a mask (N95 or KN95) if going outside');
  } else if (aqi <= 200) {
    recommendations.general.push('Everyone should reduce prolonged outdoor exertion.');
    recommendations.protective.push('Wear a mask (N95 or KN95) when outdoors');
    recommendations.protective.push('Keep windows and doors closed');
  } else if (aqi <= 300) {
    recommendations.general.push('Everyone should avoid all outdoor exertion.');
    recommendations.protective.push('Stay indoors with filtered air if possible');
    recommendations.protective.push('Wear N95/KN95 mask if you must go outside');
    recommendations.protective.push('Run air purifiers indoors');
  } else {
    recommendations.general.push('EMERGENCY: Remain indoors and avoid all physical activity.');
    recommendations.protective.push('Do NOT go outside unless absolutely necessary');
    recommendations.protective.push('Seal windows and doors');
    recommendations.protective.push('Use air purifiers on high setting');
    recommendations.protective.push('Consider evacuation if conditions persist');
  }

  // Activity-specific recommendations
  if (isOutdoorActivity) {
    if (aqi > 100) {
      recommendations.activity.push('Postpone outdoor activities if possible');
      recommendations.activity.push('Move activities indoors');
    }
    if (aqi > 150) {
      recommendations.activity.push('Cancel all outdoor activities');
    }
  }

  // Medical recommendations for people with conditions
  if (userConditions.hasAsthma || userConditions.hasCOPD) {
    if (aqi > 100) {
      recommendations.medical.push('Keep rescue inhaler readily available');
      recommendations.medical.push('Monitor symptoms closely');
    }
    if (aqi > 150) {
      recommendations.medical.push('Use preventive medications as prescribed');
      recommendations.medical.push('Contact healthcare provider if symptoms worsen');
    }
    if (aqi > 200) {
      recommendations.medical.push('Consider increasing controller medications (consult your doctor)');
      recommendations.medical.push('Have emergency action plan ready');
    }
  }

  if (userConditions.hasAllergies && aqi > 100) {
    recommendations.medical.push('Take allergy medications as prescribed');
    recommendations.medical.push('Keep antihistamines available');
  }

  return recommendations;
};

export const getRouteAQIAdvice = (currentAQI, destinationAQI) => {
  const currentLevel = getAQILevel(currentAQI);
  const destLevel = getAQILevel(destinationAQI);

  if (destinationAQI < currentAQI - 20) {
    return {
      shouldTravel: true,
      message: `Air quality improves at your destination (${destLevel.label}). Travel is advisable.`,
      color: 'green'
    };
  } else if (destinationAQI > currentAQI + 20) {
    return {
      shouldTravel: false,
      message: `Warning: Air quality worsens at your destination (${destLevel.label}). Consider postponing.`,
      color: 'red'
    };
  } else {
    return {
      shouldTravel: 'neutral',
      message: `Air quality is similar at your destination (${destLevel.label}).`,
      color: 'yellow'
    };
  }
};

export const estimateSaferRoute = (routes, aqiData) => {
  // Simulate route AQI scoring (in production, this would use real AQI data along routes)
  return routes.map(route => {
    // Mock AQI calculation based on route characteristics
    const baseAQI = aqiData.current || 100;
    const variation = Math.random() * 50 - 25; // Random variation
    const routeAQI = Math.max(0, Math.min(500, baseAQI + variation));

    return {
      ...route,
      avgAQI: Math.round(routeAQI),
      aqiLevel: getAQILevel(routeAQI),
      healthScore: calculateHealthScore(routeAQI)
    };
  }).sort((a, b) => a.avgAQI - b.avgAQI); // Sort by best air quality
};

const calculateHealthScore = (aqi) => {
  if (aqi <= 50) return 10;
  if (aqi <= 100) return 8;
  if (aqi <= 150) return 6;
  if (aqi <= 200) return 4;
  if (aqi <= 300) return 2;
  return 1;
};

export const formatAQI = (aqi) => {
  return Math.round(aqi);
};

export const getAlertSound = (alertLevel) => {
  // Return appropriate alert sound based on severity
  switch (alertLevel) {
    case 'critical':
    case 'emergency':
      return 'urgent';
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    default:
      return 'low';
  }
};
