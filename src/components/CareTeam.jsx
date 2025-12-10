import React, { useState, useEffect } from 'react';

function CareTeam() {
  const [showAddContact, setShowAddContact] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    email: '',
    phone: '',
    canViewSymptoms: false,
    canViewAirQuality: false,
    canReceiveAlerts: false
  });

  const relationshipTypes = [
    { value: 'doctor', label: 'Healthcare Provider', icon: 'Dr' },
    { value: 'specialist', label: 'Specialist', icon: 'Sp' },
    { value: 'nurse', label: 'Nurse/Care Provider', icon: 'RN' },
    { value: 'family', label: 'Family Member', icon: 'FM' },
    { value: 'friend', label: 'Friend', icon: 'FR' },
    { value: 'caregiver', label: 'Caregiver', icon: 'CG' },
    { value: 'emergency', label: 'Emergency Contact', icon: 'EC' }
  ];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('careTeam') || '[]');
    setContacts(saved);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newContact = {
      id: Date.now(),
      ...formData,
      addedDate: new Date().toISOString(),
      consentGiven: true,
      consentDate: new Date().toISOString()
    };

    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    localStorage.setItem('careTeam', JSON.stringify(updatedContacts));

    // Reset form
    setFormData({
      name: '',
      relationship: '',
      email: '',
      phone: '',
      canViewSymptoms: false,
      canViewAirQuality: false,
      canReceiveAlerts: false
    });
    setShowAddContact(false);
  };

  const removeContact = (id) => {
    if (confirm('Are you sure you want to remove this contact from your care team?')) {
      const updated = contacts.filter(c => c.id !== id);
      setContacts(updated);
      localStorage.setItem('careTeam', JSON.stringify(updated));
    }
  };

  const togglePermission = (id, permission) => {
    const updated = contacts.map(contact => {
      if (contact.id === id) {
        return { ...contact, [permission]: !contact[permission] };
      }
      return contact;
    });
    setContacts(updated);
    localStorage.setItem('careTeam', JSON.stringify(updated));
  };

  const getRelationshipIcon = (type) => {
    return relationshipTypes.find(r => r.value === type)?.icon || '👤';
  };

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-6 rounded-lg shadow-md bg-black bg-opacity-70 border border-white border-opacity-20">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-white">My Care Team</h3>
            <span className="px-3 py-1 bg-orange-500 bg-opacity-80 text-white text-sm font-bold rounded-full">
              {contacts.length}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {contacts.length === 0 ? 'No members added' : `${contacts.length} member${contacts.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex gap-2">
          {contacts.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors text-sm"
            >
              {isExpanded ? 'Hide' : 'Show'}
            </button>
          )}
          {!showAddContact && (
            <button
              onClick={() => setShowAddContact(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 border border-white border-opacity-30 text-sm"
            >
              Add
            </button>
          )}
        </div>
      </div>

      {/* Add Contact Form */}
      {showAddContact && (
        <div className="mb-6 p-4 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20">
          <h4 className="font-semibold text-white mb-4">Add New Care Team Member</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Dr. Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">-- Select --</option>
                  {relationshipTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Data Sharing Permissions */}
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <h5 className="font-medium text-gray-800 mb-3">Sharing Permissions</h5>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.canViewSymptoms}
                    onChange={(e) => setFormData({ ...formData, canViewSymptoms: e.target.checked })}
                    className="mr-3 text-black focus:ring-black rounded"
                  />
                  <span className="text-sm text-gray-700">Can view symptom logs</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.canViewAirQuality}
                    onChange={(e) => setFormData({ ...formData, canViewAirQuality: e.target.checked })}
                    className="mr-3 text-black focus:ring-black rounded"
                  />
                  <span className="text-sm text-gray-700">Can view air quality data</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.canReceiveAlerts}
                    onChange={(e) => setFormData({ ...formData, canReceiveAlerts: e.target.checked })}
                    className="mr-3 text-black focus:ring-black rounded"
                  />
                  <span className="text-sm text-gray-700">Can receive health alerts</span>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <p className="text-xs text-gray-800">
                <strong>Privacy Notice:</strong> By adding this contact, you consent to sharing the selected health information with them. You can modify or revoke permissions at any time.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors"
              >
                Add to Care Team
              </button>
              <button
                type="button"
                onClick={() => setShowAddContact(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contacts List */}
      {isExpanded && (
        <div className="space-y-3">
          {contacts.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No care team members added yet. Add someone to share your health data with.
            </p>
          ) : (
            contacts.map((contact) => (
            <div key={contact.id} className="bg-white bg-opacity-10 p-4 rounded-lg border border-white border-opacity-20">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm border border-white border-opacity-30">
                    {getRelationshipIcon(contact.relationship)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{contact.name}</h4>
                    <p className="text-sm text-gray-300">
                      {relationshipTypes.find(r => r.value === contact.relationship)?.label}
                    </p>
                    {contact.email && (
                      <p className="text-xs text-gray-400">{contact.email}</p>
                    )}
                    {contact.phone && (
                      <p className="text-xs text-gray-400">{contact.phone}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeContact(contact.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                  title="Remove contact"
                >
                  ✕
                </button>
              </div>

              {/* Permissions */}
              <div className="bg-black bg-opacity-30 p-3 rounded-md border border-white border-opacity-20">
                <h5 className="text-xs font-semibold text-white mb-2">Sharing Permissions:</h5>
                <div className="space-y-1">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={contact.canViewSymptoms}
                      onChange={() => togglePermission(contact.id, 'canViewSymptoms')}
                      className="mr-2 text-white focus:ring-white rounded"
                    />
                    <span className="text-gray-300">View symptom logs</span>
                  </label>

                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={contact.canViewAirQuality}
                      onChange={() => togglePermission(contact.id, 'canViewAirQuality')}
                      className="mr-2 text-white focus:ring-white rounded"
                    />
                    <span className="text-gray-300">View air quality data</span>
                  </label>

                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={contact.canReceiveAlerts}
                      onChange={() => togglePermission(contact.id, 'canReceiveAlerts')}
                      className="mr-2 text-white focus:ring-white rounded"
                    />
                    <span className="text-gray-300">Receive health alerts</span>
                  </label>
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-400">
                Consent given: {new Date(contact.consentDate).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
        </div>
      )}
    </div>
  );
}

export default CareTeam;
