import * as tf from '@tensorflow/tfjs';
import { fetchFederatedData, createFederatedTrainingData } from '../services/federatedLearningService';

/**
 * Machine Learning Model for Symptom Prediction
 * Uses Federated Learning - trains on anonymized community data
 * Predicts likelihood of symptoms based on AQI and user history
 */

class SymptomPredictor {
  constructor() {
    this.model = null;
    this.isModelReady = false;
    this.communityModel = null; // Shared model from federated data
    this.usingCommunityModel = false;
  }

  // Create and train a simple neural network
  async createModel() {
    // Simple sequential model
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [5], units: 16, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'softmax' }) // 4 severity levels
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  // Prepare training data from user's symptom history
  prepareTrainingData(symptomLogs, aqiData) {
    const features = [];
    const labels = [];

    symptomLogs.forEach((log, index) => {
      // Features: [AQI, hasAsthma, hasCOPD, hasAllergies, hourOfDay]
      const aqi = aqiData[index] || 50; // Default if no AQI data
      const hour = new Date(log.timestamp).getHours();

      features.push([
        aqi / 500, // Normalize AQI (0-1)
        log.hasAsthma ? 1 : 0,
        log.hasCOPD ? 1 : 0,
        log.hasAllergies ? 1 : 0,
        hour / 24 // Normalize hour (0-1)
      ]);

      // Labels: Severity level (0=mild, 1=moderate, 2=severe, 3=critical)
      const severityMap = { 'mild': 0, 'moderate': 1, 'severe': 2, 'critical': 3 };
      const severityIndex = severityMap[log.severity] || 0;

      // One-hot encode the severity
      const label = [0, 0, 0, 0];
      label[severityIndex] = 1;
      labels.push(label);
    });

    return {
      features: tf.tensor2d(features),
      labels: tf.tensor2d(labels)
    };
  }

  // Train community model with federated data from similar users
  async trainCommunityModel(userConditions, userLocation) {
    try {
      console.log('Fetching anonymized data from community...');

      // Fetch federated data from nearby users with similar conditions
      const result = await fetchFederatedData(userConditions, userLocation, 50); // 50km radius

      if (!result.success || result.data.length === 0) {
        console.log('No federated data available');
        return false;
      }

      console.log(`Found ${result.data.length} anonymized community records`);

      // Convert federated statistics into training examples
      const trainingExamples = createFederatedTrainingData(result.data);

      if (trainingExamples.length < 5) {
        console.log('Insufficient federated data for training');
        return false;
      }

      // Prepare training data
      const features = [];
      const labels = [];

      trainingExamples.forEach(example => {
        features.push([
          example.aqi / 500,
          example.hasAsthma,
          example.hasCOPD,
          example.hasAllergies,
          example.hourOfDay / 24
        ]);

        // Convert avgSeverity to one-hot encoded label
        const severityIndex = Math.round(example.avgSeverity);
        const label = [0, 0, 0, 0];
        label[Math.min(severityIndex, 3)] = 1;
        labels.push(label);
      });

      this.communityModel = await this.createModel();
      const featuresTensor = tf.tensor2d(features);
      const labelsTensor = tf.tensor2d(labels);

      console.log('Training community model on federated data...');

      await this.communityModel.fit(featuresTensor, labelsTensor, {
        epochs: 30,
        batchSize: 8,
        validationSplit: 0.15,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (epoch % 10 === 0) {
              console.log(`Community Model - Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
            }
          }
        }
      });

      featuresTensor.dispose();
      labelsTensor.dispose();

      this.usingCommunityModel = true;
      console.log('Community model training completed!');
      return true;
    } catch (error) {
      console.error('Community model training error:', error);
      return false;
    }
  }

  // Train personal model with user's own data
  async trainModel(symptomLogs, aqiHistory, userConditions, userLocation) {
    try {
      // Add user conditions to logs
      const enrichedLogs = symptomLogs.map(log => ({
        ...log,
        ...userConditions
      }));

      // If user has insufficient personal data, use community model
      if (enrichedLogs.length < 10) {
        console.log('Not enough personal data (need at least 10 logs)');
        console.log('Training community model instead...');

        const communityTrained = await this.trainCommunityModel(userConditions, userLocation);

        if (communityTrained) {
          this.isModelReady = true;
          return true;
        }

        console.log('Using rule-based prediction as fallback');
        return false;
      }

      // User has enough data - train personal model
      this.model = await this.createModel();
      const { features, labels } = this.prepareTrainingData(enrichedLogs, aqiHistory);

      console.log('Training personalized model on your data...');

      // Train the model
      await this.model.fit(features, labels, {
        epochs: 50,
        batchSize: 4,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (epoch % 10 === 0) {
              console.log(`Personal Model - Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
            }
          }
        }
      });

      // Clean up tensors
      features.dispose();
      labels.dispose();

      this.isModelReady = true;
      this.usingCommunityModel = false;
      console.log('Personal model training completed!');
      return true;
    } catch (error) {
      console.error('Model training error:', error);
      return false;
    }
  }

  // Predict symptom severity based on current conditions
  async predict(aqi, userConditions) {
    // Choose which model to use
    const activeModel = this.usingCommunityModel ? this.communityModel : this.model;

    if (!this.isModelReady || !activeModel) {
      // Return rule-based prediction if model not ready
      return this.ruleBasedPrediction(aqi, userConditions);
    }

    try {
      const currentHour = new Date().getHours();
      const input = tf.tensor2d([[
        aqi / 500,
        userConditions.hasAsthma ? 1 : 0,
        userConditions.hasCOPD ? 1 : 0,
        userConditions.hasAllergies ? 1 : 0,
        currentHour / 24
      ]]);

      const prediction = activeModel.predict(input);
      const probabilities = await prediction.data();

      input.dispose();
      prediction.dispose();

      const severityLevels = ['mild', 'moderate', 'severe', 'critical'];
      const predictedIndex = probabilities.indexOf(Math.max(...probabilities));
      const confidence = probabilities[predictedIndex];

      return {
        severity: severityLevels[predictedIndex],
        confidence: (confidence * 100).toFixed(1),
        probabilities: {
          mild: (probabilities[0] * 100).toFixed(1),
          moderate: (probabilities[1] * 100).toFixed(1),
          severe: (probabilities[2] * 100).toFixed(1),
          critical: (probabilities[3] * 100).toFixed(1)
        },
        recommendation: this.getRecommendation(aqi, severityLevels[predictedIndex], userConditions),
        modelType: this.usingCommunityModel ? 'community' : 'personal'
      };
    } catch (error) {
      console.error('Prediction error:', error);
      return this.ruleBasedPrediction(aqi, userConditions);
    }
  }

  // Fallback rule-based prediction
  ruleBasedPrediction(aqi, userConditions) {
    let severity = 'mild';
    let confidence = 60;

    if (aqi <= 50) {
      severity = 'mild';
      confidence = 85;
    } else if (aqi <= 100) {
      severity = userConditions.hasAsthma || userConditions.hasCOPD ? 'moderate' : 'mild';
      confidence = 75;
    } else if (aqi <= 150) {
      severity = userConditions.hasAsthma || userConditions.hasCOPD ? 'severe' : 'moderate';
      confidence = 70;
    } else {
      severity = 'severe';
      confidence = 80;
      if (userConditions.hasAsthma || userConditions.hasCOPD) {
        severity = 'critical';
        confidence = 90;
      }
    }

    return {
      severity,
      confidence: confidence.toString(),
      probabilities: null,
      recommendation: this.getRecommendation(aqi, severity, userConditions),
      isRuleBased: true
    };
  }

  // Get personalized recommendations
  getRecommendation(aqi, severity, userConditions) {
    const recommendations = [];

    if (aqi > 100) {
      recommendations.push('Stay indoors with windows closed');
      recommendations.push('Use air purifier if available');
    }

    if (severity === 'severe' || severity === 'critical') {
      if (userConditions.hasAsthma) {
        recommendations.push('Have rescue inhaler readily available');
      }
      recommendations.push('Avoid all outdoor physical activities');
      recommendations.push('Consider contacting your healthcare provider');
    }

    if (severity === 'moderate') {
      recommendations.push('Limit outdoor activities');
      if (userConditions.hasAsthma || userConditions.hasCOPD) {
        recommendations.push('Take prescribed medications as directed');
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('Monitor symptoms and air quality');
      recommendations.push('Maintain normal activities with caution');
    }

    return recommendations;
  }

  // Save model to browser storage
  async saveModel() {
    if (this.model && this.isModelReady) {
      await this.model.save('localstorage://symptom-predictor-model');
      console.log('Model saved successfully');
    }
  }

  // Load model from browser storage
  async loadModel() {
    try {
      this.model = await tf.loadLayersModel('localstorage://symptom-predictor-model');
      this.isModelReady = true;
      console.log('Model loaded successfully');
      return true;
    } catch (error) {
      console.log('No saved model found, will create new one when training');
      return false;
    }
  }
}

// Export singleton instance
export const symptomPredictor = new SymptomPredictor();
