// Symptom database with condition-based ML prioritization
export const symptomDatabase = {
  // Common respiratory symptoms
  common: [
    { id: 'cough', name: 'Cough', category: 'respiratory' },
    { id: 'shortness_breath', name: 'Shortness of breath', category: 'respiratory' },
    { id: 'wheezing', name: 'Wheezing', category: 'respiratory' },
    { id: 'chest_tightness', name: 'Chest tightness', category: 'respiratory' },
    { id: 'rapid_breathing', name: 'Rapid breathing', category: 'respiratory' },
    { id: 'difficulty_breathing', name: 'Difficulty breathing', category: 'respiratory' },
  ],

  // Condition-specific symptom patterns (ML training data)
  conditionPatterns: {
    asthma: {
      primary: [
        { id: 'wheezing', name: 'Wheezing', priority: 10 },
        { id: 'shortness_breath', name: 'Shortness of breath', priority: 9 },
        { id: 'chest_tightness', name: 'Chest tightness', priority: 9 },
        { id: 'cough', name: 'Cough (especially at night)', priority: 8 },
        { id: 'difficulty_breathing', name: 'Difficulty breathing during exercise', priority: 8 },
      ],
      secondary: [
        { id: 'rapid_breathing', name: 'Rapid breathing', priority: 6 },
        { id: 'fatigue', name: 'Fatigue', priority: 5 },
        { id: 'trouble_sleeping', name: 'Trouble sleeping', priority: 5 },
        { id: 'anxiety', name: 'Anxiety or panic', priority: 4 },
      ]
    },

    copd: {
      primary: [
        { id: 'shortness_breath', name: 'Shortness of breath', priority: 10 },
        { id: 'chronic_cough', name: 'Chronic cough', priority: 9 },
        { id: 'mucus_production', name: 'Mucus production', priority: 9 },
        { id: 'wheezing', name: 'Wheezing', priority: 8 },
        { id: 'chest_tightness', name: 'Chest tightness', priority: 8 },
      ],
      secondary: [
        { id: 'fatigue', name: 'Fatigue', priority: 7 },
        { id: 'weight_loss', name: 'Unintended weight loss', priority: 6 },
        { id: 'swollen_ankles', name: 'Swollen ankles/feet/legs', priority: 5 },
        { id: 'frequent_infections', name: 'Frequent respiratory infections', priority: 6 },
      ]
    },

    allergies: {
      primary: [
        { id: 'sneezing', name: 'Sneezing', priority: 10 },
        { id: 'runny_nose', name: 'Runny or stuffy nose', priority: 10 },
        { id: 'itchy_eyes', name: 'Itchy, watery eyes', priority: 9 },
        { id: 'cough', name: 'Cough', priority: 7 },
        { id: 'wheezing', name: 'Wheezing', priority: 7 },
      ],
      secondary: [
        { id: 'itchy_throat', name: 'Itchy throat', priority: 6 },
        { id: 'postnasal_drip', name: 'Post-nasal drip', priority: 6 },
        { id: 'sinus_pressure', name: 'Sinus pressure', priority: 5 },
        { id: 'headache', name: 'Headache', priority: 4 },
      ]
    },

    none: {
      primary: [
        { id: 'cough', name: 'Cough', priority: 7 },
        { id: 'shortness_breath', name: 'Shortness of breath', priority: 7 },
        { id: 'chest_pain', name: 'Chest discomfort', priority: 6 },
        { id: 'wheezing', name: 'Wheezing', priority: 6 },
      ],
      secondary: [
        { id: 'runny_nose', name: 'Runny nose', priority: 5 },
        { id: 'sneezing', name: 'Sneezing', priority: 5 },
        { id: 'fatigue', name: 'Fatigue', priority: 4 },
        { id: 'headache', name: 'Headache', priority: 4 },
      ]
    }
  },

  // All available symptoms
  allSymptoms: [
    { id: 'wheezing', name: 'Wheezing' },
    { id: 'shortness_breath', name: 'Shortness of breath' },
    { id: 'chest_tightness', name: 'Chest tightness' },
    { id: 'cough', name: 'Cough' },
    { id: 'chronic_cough', name: 'Chronic cough' },
    { id: 'difficulty_breathing', name: 'Difficulty breathing' },
    { id: 'rapid_breathing', name: 'Rapid breathing' },
    { id: 'mucus_production', name: 'Mucus production' },
    { id: 'sneezing', name: 'Sneezing' },
    { id: 'runny_nose', name: 'Runny or stuffy nose' },
    { id: 'itchy_eyes', name: 'Itchy, watery eyes' },
    { id: 'itchy_throat', name: 'Itchy throat' },
    { id: 'postnasal_drip', name: 'Post-nasal drip' },
    { id: 'sinus_pressure', name: 'Sinus pressure' },
    { id: 'chest_pain', name: 'Chest pain/discomfort' },
    { id: 'fatigue', name: 'Fatigue' },
    { id: 'headache', name: 'Headache' },
    { id: 'trouble_sleeping', name: 'Trouble sleeping' },
    { id: 'anxiety', name: 'Anxiety or panic' },
    { id: 'weight_loss', name: 'Unintended weight loss' },
    { id: 'swollen_ankles', name: 'Swollen ankles/feet/legs' },
    { id: 'frequent_infections', name: 'Frequent respiratory infections' },
    { id: 'fever', name: 'Fever' },
    { id: 'body_aches', name: 'Body aches' },
    { id: 'dizziness', name: 'Dizziness' },
  ]
};

/**
 * ML-based symptom prioritization algorithm
 * Uses user's medical history to predict and prioritize likely symptoms
 */
export const getPrioritizedSymptoms = (userData) => {
  const questionnaireData = JSON.parse(localStorage.getItem('questionnaireData') || '{}');

  // Determine user's conditions
  const conditions = [];
  if (questionnaireData.hasAsthma === 'yes') conditions.push('asthma');
  if (questionnaireData.hasCOPD === 'yes') conditions.push('copd');
  if (questionnaireData.hasAllergies === 'yes') conditions.push('allergies');

  // If no conditions, use general pattern
  if (conditions.length === 0) conditions.push('none');

  // Collect and score symptoms based on conditions
  const symptomScores = new Map();

  conditions.forEach(condition => {
    const pattern = symptomDatabase.conditionPatterns[condition];
    if (pattern) {
      // Add primary symptoms with high scores
      pattern.primary.forEach(symptom => {
        const currentScore = symptomScores.get(symptom.id) || 0;
        symptomScores.set(symptom.id, currentScore + symptom.priority);
      });

      // Add secondary symptoms with lower scores
      pattern.secondary.forEach(symptom => {
        const currentScore = symptomScores.get(symptom.id) || 0;
        symptomScores.set(symptom.id, currentScore + symptom.priority);
      });
    }
  });

  // Create prioritized list
  const prioritizedSymptoms = [];
  const seenSymptoms = new Set();

  // First, add symptoms with scores (sorted by score)
  const scoredSymptoms = Array.from(symptomScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => {
      const symptom = symptomDatabase.allSymptoms.find(s => s.id === id);
      return { ...symptom, score };
    });

  prioritizedSymptoms.push(...scoredSymptoms);
  scoredSymptoms.forEach(s => seenSymptoms.add(s.id));

  // Then add remaining symptoms alphabetically
  const remainingSymptoms = symptomDatabase.allSymptoms
    .filter(s => !seenSymptoms.has(s.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  prioritizedSymptoms.push(...remainingSymptoms);

  return prioritizedSymptoms;
};

/**
 * Get symptom suggestions based on current conditions and environmental factors
 */
export const getSmartSuggestions = (currentAQI, timeOfDay) => {
  const prioritized = getPrioritizedSymptoms();

  // Filter suggestions based on environmental factors
  if (currentAQI > 100) {
    // Poor air quality - prioritize respiratory symptoms
    return prioritized.filter(s =>
      ['wheezing', 'shortness_breath', 'cough', 'chest_tightness', 'difficulty_breathing']
        .includes(s.id)
    ).slice(0, 5);
  }

  if (timeOfDay === 'night' || timeOfDay === 'early_morning') {
    // Night/early morning - prioritize asthma-related symptoms
    return prioritized.filter(s =>
      ['cough', 'wheezing', 'trouble_sleeping', 'chest_tightness']
        .includes(s.id)
    ).slice(0, 5);
  }

  // Return top prioritized symptoms
  return prioritized.slice(0, 8);
};

export const severityLevels = [
  { value: 'mild', label: 'Mild', color: 'green', description: 'Noticeable but not bothersome' },
  { value: 'moderate', label: 'Moderate', color: 'yellow', description: 'Somewhat bothersome' },
  { value: 'severe', label: 'Severe', color: 'orange', description: 'Very bothersome' },
  { value: 'very_severe', label: 'Very Severe', color: 'red', description: 'Extremely bothersome, may need medical attention' },
];

export const triggers = [
  'Air pollution',
  'Pollen/allergies',
  'Exercise',
  'Cold air',
  'Smoke exposure',
  'Strong odors',
  'Stress',
  'Weather change',
  'Dust',
  'Pet dander',
  'Unknown',
  'Other'
];
