import React, { useState, useEffect } from 'react';
import { symptomPredictor } from '../ml/symptomPredictor';

export default function MLPrediction({ currentAQI, userConditions }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPrediction = async () => {
      setLoading(true);

      // Try to load saved model
      await symptomPredictor.loadModel();

      // Get prediction
      const result = await symptomPredictor.predict(currentAQI, userConditions);
      setPrediction(result);
      setLoading(false);
    };

    if (currentAQI && userConditions) {
      getPrediction();
    }
  }, [currentAQI, userConditions]);

  if (loading) {
    return (
      <div className="p-6 rounded-xl shadow-sm bg-white dark:bg-[#1A2E22] border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-4">AI Health Insights</h3>
        <div className="text-text-secondary text-base">Loading prediction...</div>
      </div>
    );
  }

  if (!prediction) return null;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'text-primary bg-primary/20 border-primary';
      case 'moderate': return 'text-yellow-600 bg-yellow-100 border-yellow-500 dark:text-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-600';
      case 'severe': return 'text-red-600 bg-red-100 border-red-500 dark:text-red-400 dark:bg-red-900/30 dark:border-red-600';
      case 'critical': return 'text-red-700 bg-red-200 border-red-600 dark:text-red-300 dark:bg-red-900/50 dark:border-red-700';
      default: return 'text-text-secondary bg-gray-100 border-gray-400 dark:bg-gray-800 dark:border-gray-600';
    }
  };

  return (
    <div className="p-6 rounded-xl shadow-sm bg-white dark:bg-[#1A2E22] border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-text-primary dark:text-white">AI Health Insights</h3>
        <div className="flex flex-col items-end gap-1">
          {prediction.modelType === 'community' && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded border border-primary">
              Community Model
            </span>
          )}
          {prediction.modelType === 'personal' && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded border border-primary">
              Personal Model
            </span>
          )}
          {prediction.isRuleBased && (
            <span className="text-xs text-text-secondary italic">Rule-based</span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Main Prediction */}
        <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base text-text-primary dark:text-white">Predicted Severity:</span>
            <span className={`px-3 py-1 rounded-full text-base font-semibold border ${getSeverityColor(prediction.severity)}`}>
              {prediction.severity.toUpperCase()}
            </span>
          </div>
          <div className="text-sm text-text-secondary">
            Confidence: {prediction.confidence}%
          </div>
        </div>

        {/* Probability Breakdown (if available) */}
        {prediction.probabilities && (
          <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-base font-medium text-text-primary dark:text-white mb-3">Probability Breakdown:</div>
            <div className="space-y-2">
              {Object.entries(prediction.probabilities).map(([level, prob]) => (
                <div key={level} className="flex items-center gap-2">
                  <span className="text-sm text-text-primary dark:text-white w-20 capitalize">{level}:</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${prob}%` }}
                    />
                  </div>
                  <span className="text-sm text-text-primary dark:text-white w-12 text-right">{prob}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-base font-medium text-text-primary dark:text-white mb-3">AI Recommendations:</div>
          <ul className="space-y-2">
            {prediction.recommendation.map((rec, index) => (
              <li key={index} className="text-base text-text-secondary flex gap-2">
                <span className="text-primary">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Training Status */}
        <div className="text-sm text-text-secondary italic text-center pt-2 border-t border-gray-200 dark:border-gray-700">
          {prediction.isRuleBased && (
            "AI model will improve as you log more symptoms (need 10+ logs to train)"
          )}
          {prediction.modelType === 'community' && (
            "Using anonymized data from nearby users with similar conditions"
          )}
          {prediction.modelType === 'personal' && (
            "AI prediction based on your personal symptom history"
          )}
        </div>
      </div>
    </div>
  );
}
