import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPrioritizedSymptoms, severityLevels, triggers } from '../utils/symptomML';

export default function SymptomLogger() {
  const navigate = useNavigate();
  const [prioritizedSymptoms, setPrioritizedSymptoms] = useState([]);
  const [entries, setEntries] = useState([]);

  const [formData, setFormData] = useState({
    symptom: '',
    severity: '',
    trigger: '',
    notes: ''
  });

  useEffect(() => {
    const symptoms = getPrioritizedSymptoms();
    setPrioritizedSymptoms(symptoms);

    const saved = JSON.parse(localStorage.getItem('symptomLogs') || '[]');
    setEntries(saved);
  }, []);

  const logSymptom = () => {
    if (formData.symptom && formData.severity) {
      const newEntry = {
        id: Date.now(),
        symptom: formData.symptom,
        severity: formData.severity,
        trigger: formData.trigger,
        notes: formData.notes,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString(),
        timestamp: new Date().toISOString()
      };

      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      localStorage.setItem('symptomLogs', JSON.stringify(updatedEntries));

      setFormData({ symptom: '', severity: '', trigger: '', notes: '' });
    }
  };

  const getSeverityColor = (severity) => {
    const level = severityLevels.find(s => s.value === severity);
    return level ? level.color : 'gray';
  };

  const getSeverityBadgeClass = (severity) => {
    const colorMap = {
      green: 'bg-green-100 text-green-800 border-green-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      orange: 'bg-orange-100 text-orange-800 border-orange-300',
      red: 'bg-red-100 text-red-800 border-red-300'
    };
    const color = getSeverityColor(severity);
    return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const deleteEntry = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem('symptomLogs', JSON.stringify(updatedEntries));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg shadow-xl p-8" style={{background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'}}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Log Symptoms</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Symptom Form */}
          <div className="mb-8 p-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Symptom</h2>
            <div className="space-y-4">
              {/* Symptom Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Symptom <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.symptom}
                  onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
                  required
                >
                  <option value="">-- Choose a symptom --</option>

                  {/* Prioritized symptoms */}
                  <optgroup label="Most Likely For You">
                    {prioritizedSymptoms.slice(0, 8).map(symptom => (
                      <option key={symptom.id} value={symptom.name}>
                        {symptom.name}
                      </option>
                    ))}
                  </optgroup>

                  {/* All other symptoms */}
                  {prioritizedSymptoms.length > 8 && (
                    <optgroup label="Other Symptoms">
                      {prioritizedSymptoms.slice(8).map(symptom => (
                        <option key={symptom.id} value={symptom.name}>
                          {symptom.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Top suggestions are based on your medical profile
                </p>
              </div>

              {/* Severity Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {severityLevels.map(level => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, severity: level.value })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        formData.severity === level.value
                          ? `border-${level.color}-500 bg-${level.color}-50 shadow-md`
                          : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                      }`}
                    >
                      <div className="font-medium text-sm">{level.label}</div>
                      <div className="text-xs text-gray-600">{level.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trigger Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Possible Trigger (Optional)
                </label>
                <select
                  value={formData.trigger}
                  onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
                >
                  <option value="">-- Select trigger if known --</option>
                  {triggers.map(trigger => (
                    <option key={trigger} value={trigger}>{trigger}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional details..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={logSymptom}
                  disabled={!formData.symptom || !formData.severity}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  Save Symptom
                </button>
              </div>
            </div>
          </div>

          {/* Entries List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Symptom History</h2>
            {entries.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">
                  No symptoms logged yet. Fill out the form above to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {entries.map((entry) => (
                  <div key={entry.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-800 text-lg">{entry.symptom}</h4>
                          <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getSeverityBadgeClass(entry.severity)}`}>
                            {severityLevels.find(s => s.value === entry.severity)?.label}
                          </span>
                        </div>
                        {entry.trigger && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Trigger:</span> {entry.trigger}
                          </p>
                        )}
                        {entry.notes && (
                          <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">{entry.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-3 px-2 py-1 rounded transition-colors"
                        title="Delete entry"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span>{entry.date}</span>
                      <span>{entry.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
