import React, { useState, useEffect } from 'react';
import { getPrioritizedSymptoms, severityLevels, triggers } from '../utils/symptomML';

export default function SymptomLog() {
  const [showForm, setShowForm] = useState(false);
  const [prioritizedSymptoms, setPrioritizedSymptoms] = useState([]);
  const [entries, setEntries] = useState([]);

  const [formData, setFormData] = useState({
    symptom: '',
    severity: '',
    trigger: '',
    notes: ''
  });

  useEffect(() => {
    // Load prioritized symptoms based on user's conditions
    const symptoms = getPrioritizedSymptoms();
    setPrioritizedSymptoms(symptoms);

    // Load saved entries from localStorage
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

      // Save to localStorage
      localStorage.setItem('symptomLogs', JSON.stringify(updatedEntries));

      // Reset form
      setFormData({ symptom: '', severity: '', trigger: '', notes: '' });
      setShowForm(false);
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
    <div className="p-6 rounded-lg shadow-md" style={{background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'}}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Log Symptoms</h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            Add Symptom
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-4">
            {/* Symptom Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Symptom <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.symptom}
                onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">-- Choose a symptom --</option>

                {/* Prioritized symptoms (top suggestions based on user's conditions) */}
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
              <div className="grid grid-cols-2 gap-2">
                {severityLevels.map(level => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, severity: level.value })}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      formData.severity === level.value
                        ? `border-${level.color}-500 bg-${level.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
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
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={logSymptom}
                disabled={!formData.symptom || !formData.severity}
                className="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Save Symptom
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({ symptom: '', severity: '', trigger: '', notes: '' });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entries List */}
      <div className="max-h-96 overflow-y-auto">
        {entries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No symptoms logged yet. Click "Add Symptom" to get started.
          </p>
        ) : (
          <ul className="space-y-3">
            {entries.map((entry) => (
              <li key={entry.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800">{entry.symptom}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityBadgeClass(entry.severity)}`}>
                        {severityLevels.find(s => s.value === entry.severity)?.label}
                      </span>
                    </div>
                    {entry.trigger && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Trigger:</span> {entry.trigger}
                      </p>
                    )}
                    {entry.notes && (
                      <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-red-500 hover:text-red-700 ml-2 text-sm"
                    title="Delete entry"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{entry.date}</span>
                  <span>{entry.time}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 