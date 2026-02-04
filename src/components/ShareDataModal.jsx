import React, { useState, useEffect } from 'react';

function ShareDataModal({ isOpen, onClose }) {
  const [careTeam, setCareTeam] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [shareType, setShareType] = useState('current'); // 'current' or 'range'
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [includeData, setIncludeData] = useState({
    symptoms: true,
    airQuality: true,
    medicalHistory: false,
    notes: true
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const team = JSON.parse(localStorage.getItem('careTeam') || '[]');
      setCareTeam(team);
    }
  }, [isOpen]);

  const handleShare = () => {
    if (selectedContacts.length === 0) {
      alert('Please select at least one person to share with.');
      return;
    }

    // Generate report
    const report = generateReport();

    // Simulate sharing (in a real app, this would send via email/API)
    const shareLog = {
      id: Date.now(),
      sharedWith: selectedContacts.map(id => {
        const contact = careTeam.find(c => c.id === id);
        return { id: contact.id, name: contact.name, relationship: contact.relationship };
      }),
      shareType,
      dateRange,
      includeData,
      message,
      sharedAt: new Date().toISOString(),
      report
    };

    // Save to share history
    const history = JSON.parse(localStorage.getItem('shareHistory') || '[]');
    history.unshift(shareLog);
    localStorage.setItem('shareHistory', JSON.stringify(history));

    alert(`Health data shared successfully with ${selectedContacts.length} contact(s)!`);
    onClose();
  };

  const generateReport = () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const questionnaireData = JSON.parse(localStorage.getItem('questionnaireData') || '{}');
    const symptomLogs = JSON.parse(localStorage.getItem('symptomLogs') || '[]');

    let report = {
      patientName: userData.name,
      generatedAt: new Date().toISOString(),
      dateRange: shareType === 'range' ? dateRange : 'Current snapshot',
      data: {}
    };

    if (includeData.medicalHistory) {
      report.data.medicalHistory = {
        age: questionnaireData.age,
        conditions: {
          asthma: questionnaireData.hasAsthma === 'yes',
          copd: questionnaireData.hasCOPD === 'yes',
          allergies: questionnaireData.hasAllergies === 'yes'
        },
        lifestyle: {
          location: questionnaireData.location,
          smoker: questionnaireData.smoker,
          exercise: questionnaireData.exercise
        }
      };
    }

    if (includeData.symptoms) {
      let filteredSymptoms = symptomLogs;
      if (shareType === 'range') {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        filteredSymptoms = symptomLogs.filter(log => {
          const logDate = new Date(log.timestamp);
          return logDate >= startDate && logDate <= endDate;
        });
      }
      report.data.symptoms = filteredSymptoms;
    }

    if (includeData.notes && message) {
      report.data.patientNotes = message;
    }

    return report;
  };

  const toggleContact = (id) => {
    setSelectedContacts(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1A2E22] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-primary text-text-primary dark:text-background-dark p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Share Health Data</h2>
              <p className="text-sm opacity-90">Securely share your health information</p>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Select Recipients */}
          <div>
            <h3 className="font-semibold text-text-primary dark:text-white mb-3">Share With:</h3>
            {careTeam.length === 0 ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-600 rounded-xl p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  No care team members added yet. Add contacts in the Care Team section first.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-background-light dark:bg-background-dark">
                {careTeam.map(contact => (
                  <label key={contact.id} className="flex items-center p-2 hover:bg-primary/10 rounded-lg cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => toggleContact(contact.id)}
                      className="mr-3 text-primary focus:ring-primary rounded"
                    />
                    <div>
                      <span className="font-medium text-text-primary dark:text-white">{contact.name}</span>
                      <span className="text-sm text-text-secondary ml-2">
                        ({contact.relationship})
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Time Range */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Time Period:</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="shareType"
                  value="current"
                  checked={shareType === 'current'}
                  onChange={(e) => setShareType(e.target.value)}
                  className="mr-3 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">Current snapshot (all data)</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="shareType"
                  value="range"
                  checked={shareType === 'range'}
                  onChange={(e) => setShareType(e.target.value)}
                  className="mr-3 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700">Specific date range</span>
              </label>

              {shareType === 'range' && (
                <div className="ml-7 grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Data to Include */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Include:</h3>
            <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeData.symptoms}
                  onChange={(e) => setIncludeData({ ...includeData, symptoms: e.target.checked })}
                  className="mr-3 text-green-600 focus:ring-green-500 rounded"
                />
                <span className="text-gray-700">Symptom logs</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeData.airQuality}
                  onChange={(e) => setIncludeData({ ...includeData, airQuality: e.target.checked })}
                  className="mr-3 text-green-600 focus:ring-green-500 rounded"
                />
                <span className="text-gray-700">Air quality exposure data</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeData.medicalHistory}
                  onChange={(e) => setIncludeData({ ...includeData, medicalHistory: e.target.checked })}
                  className="mr-3 text-green-600 focus:ring-green-500 rounded"
                />
                <span className="text-gray-700">Medical history & profile</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeData.notes}
                  onChange={(e) => setIncludeData({ ...includeData, notes: e.target.checked })}
                  className="mr-3 text-green-600 focus:ring-green-500 rounded"
                />
                <span className="text-gray-700">Include message/notes</span>
              </label>
            </div>
          </div>

          {/* Message/Notes */}
          {includeData.notes && (
            <div>
              <label className="block font-semibold text-gray-800 mb-2">
                Message to Recipients (Optional):
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add any context or notes for the recipient..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>🔒 Privacy & Consent:</strong> By clicking "Share Data", you confirm that you consent to sharing the selected health information with the chosen recipients. This action will be logged for your records.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleShare}
              disabled={selectedContacts.length === 0}
              className="flex-1 bg-primary text-text-primary dark:text-background-dark px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📤 Share Data
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-text-primary dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareDataModal;
