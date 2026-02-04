import React, { useState } from 'react';

export default function LocationSelector({ currentLocation, onLocationChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const popularLocations = [
    { name: 'San Francisco, CA', coords: { lat: 37.7749, lon: -122.4194 } },
    { name: 'Los Angeles, CA', coords: { lat: 34.0522, lon: -118.2437 } },
    { name: 'New York, NY', coords: { lat: 40.7128, lon: -74.0060 } },
    { name: 'Chicago, IL', coords: { lat: 41.8781, lon: -87.6298 } },
    { name: 'Houston, TX', coords: { lat: 29.7604, lon: -95.3698 } },
    { name: 'Phoenix, AZ', coords: { lat: 33.4484, lon: -112.0740 } },
    { name: 'Philadelphia, PA', coords: { lat: 39.9526, lon: -75.1652 } },
    { name: 'Seattle, WA', coords: { lat: 47.6062, lon: -122.3321 } },
  ];

  const filteredLocations = popularLocations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (location) => {
    onLocationChange(location);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-[#1A2E22] transition-all hover:shadow-md"
      >
        <span className="material-symbols-outlined text-primary" style={{fontSize: '20px'}}>location_on</span>
        <span className="text-sm font-bold text-text-primary dark:text-white">{currentLocation}</span>
        <span className="material-symbols-outlined text-text-secondary" style={{fontSize: '18px'}}>
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-[#1A2E22] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 bg-background-light dark:bg-background-dark rounded-lg px-3 py-2">
                <span className="material-symbols-outlined text-text-secondary" style={{fontSize: '20px'}}>search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search location..."
                  className="flex-1 bg-transparent text-sm text-text-primary dark:text-white outline-none placeholder-text-secondary"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filteredLocations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(location)}
                  className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <span className="material-symbols-outlined text-primary" style={{fontSize: '20px'}}>place</span>
                  <span className="text-sm font-medium text-text-primary dark:text-white">{location.name}</span>
                </button>
              ))}
              {filteredLocations.length === 0 && (
                <div className="px-4 py-8 text-center text-text-secondary text-sm">
                  No locations found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
