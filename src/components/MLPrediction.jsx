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
      <div className="p-6 rounded-xl shadow-md bg-black bg-opacity-70 border border-white border-opacity-20">
        <h3 className="text-xl font-semibold text-white mb-4">AI Symptom Prediction</h3>
        <div className="text-gray-300 text-base">Loading prediction...</div>
      </div>
    );
  }

  if (!prediction) return null;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'text-green-300 bg-green-900 bg-opacity-50 border-green-400';
      case 'moderate': return 'text-yellow-300 bg-yellow-900 bg-opacity-50 border-yellow-400';
      case 'severe': return 'text-orange-300 bg-orange-900 bg-opacity-50 border-orange-400';
      case 'critical': return 'text-red-300 bg-red-900 bg-opacity-50 border-red-400';
      default: return 'text-gray-300 bg-gray-900 bg-opacity-50 border-gray-400';
    }
  };

  return (
    <div className="p-6 rounded-xl shadow-md bg-black bg-opacity-70 border border-white border-opacity-20">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">AI Symptom Prediction</h3>
        <div className="flex flex-col items-end gap-1">
          {prediction.modelType === 'community' && (
            <span className="text-xs bg-blue-900 bg-opacity-50 text-blue-300 px-2 py-1 rounded border border-blue-400">
              Community Model
            </span>
          )}
          {prediction.modelType === 'personal' && (
            <span className="text-xs bg-green-900 bg-opacity-50 text-green-300 px-2 py-1 rounded border border-green-400">
              Personal Model
            </span>
          )}
          {prediction.isRuleBased && (
            <span className="text-xs text-gray-400 italic">Rule-based</span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Main Prediction */}
        <div className="bg-black p-4 rounded-lg border-2 border-white border-opacity-20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base text-gray-300">Predicted Severity:</span>
            <span className={`px-3 py-1 rounded-full text-base font-semibold border ${getSeverityColor(prediction.severity)}`}>
              {prediction.severity.toUpperCase()}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Confidence: {prediction.confidence}%
          </div>
        </div>

        {/* Probability Breakdown (if available) */}
        {prediction.probabilities && (
          <div className="bg-black p-4 rounded-lg border border-white border-opacity-20">
            <div className="text-base font-medium text-white mb-3">Probability Breakdown:</div>
            <div className="space-y-2">
              {Object.entries(prediction.probabilities).map(([level, prob]) => (
                <div key={level} className="flex items-center gap-2">
                  <span className="text-sm text-gray-300 w-20 capitalize">{level}:</span>
                  <div className="flex-1 bg-white bg-opacity-20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all"
                      style={{ width: `${prob}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-300 w-12 text-right">{prob}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-black p-4 rounded-lg border border-white border-opacity-20">
          <div className="text-base font-medium text-white mb-3">AI Recommendations:</div>
          <ul className="space-y-2">
            {prediction.recommendation.map((rec, index) => (
              <li key={index} className="text-base text-gray-300 flex gap-2">
                <span className="text-gray-400">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Training Status */}
        <div className="text-sm text-gray-400 italic text-center pt-2 border-t border-white border-opacity-20">
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
