import React, { useState, useEffect } from "react";
import AlertBanner from "../components/AlertBanner";
import AQISphere from "../components/AQISphere";
import SymptomLog from "../components/SymptomLog";
import ChatBot from "../components/ChatBot";
import CareTeam from "../components/CareTeam";
import ShareDataModal from "../components/ShareDataModal";
import FullScreenAQIAlert from "../components/FullScreenAQIAlert";
import AQITestButton from "../components/AQITestButton";
import RunningAvatar from "../components/RunningAvatar";
import MLPrediction from "../components/MLPrediction";
import LocationSelector from "../components/LocationSelector";
import { shouldShowFullScreenAlert } from "../utils/aqiUtils";

function Dashboard() {
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('👤');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFullScreenAlert, setShowFullScreenAlert] = useState(false);
  const [currentAQI, setCurrentAQI] = useState(null);
  const [userConditions, setUserConditions] = useState({});
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [showAICallout, setShowAICallout] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('San Francisco, CA');
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.name) setUserName(userData.name);
    if (userData.avatar?.value) setUserAvatar(userData.avatar.value);

    // Load user conditions
    const questionnaireData = JSON.parse(localStorage.getItem('questionnaireData') || '{}');
    setUserConditions({
      hasAsthma: questionnaireData.hasAsthma === 'yes',
      hasCOPD: questionnaireData.hasCOPD === 'yes',
      hasAllergies: questionnaireData.hasAllergies === 'yes'
    });
  }, []);

  useEffect(() => {
    // Fetch real AQI data
    const fetchAQI = async () => {
      try {
        const { getAQIData } = await import('../services/aqiService');
        const data = await getAQIData();
        setCurrentAQI(data.aqi);

        // Check if we should show full screen alert
        if (!alertDismissed && shouldShowFullScreenAlert(data.aqi, userConditions)) {
          setShowFullScreenAlert(true);
        }
      } catch (error) {
        console.error('Failed to fetch AQI for alerts:', error);
        // Use fallback AQI for testing
        const fallbackAQI = 165;
        setCurrentAQI(fallbackAQI);

        if (!alertDismissed && shouldShowFullScreenAlert(fallbackAQI, userConditions)) {
          setTimeout(() => {
            setShowFullScreenAlert(true);
          }, 2000);
        }
      }
    };

    // Initial fetch
    if (Object.keys(userConditions).length > 0) {
      fetchAQI();
    }

    // Set up periodic AQI checks (every 5 minutes)
    const aqiCheckInterval = setInterval(() => {
      fetchAQI();
    }, 300000);

    return () => clearInterval(aqiCheckInterval);
  }, [userConditions, alertDismissed]);

  const handleDismissAlert = () => {
    setShowFullScreenAlert(false);
    setAlertDismissed(true);

    // Reset alert dismissed after 1 hour
    setTimeout(() => {
      setAlertDismissed(false);
    }, 3600000);
  };

  const handleTestAlert = (testAQI) => {
    setCurrentAQI(testAQI);
    setAlertDismissed(false);
    if (shouldShowFullScreenAlert(testAQI, userConditions)) {
      setShowFullScreenAlert(true);
    } else {
      alert(`AQI ${testAQI} does not trigger alert for your conditions`);
    }
  };

  return (
    <>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="relative mx-auto flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
        {/* Top App Bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between bg-background-light/95 px-4 py-3 backdrop-blur-sm dark:bg-background-dark/95 max-w-7xl mx-auto w-full">
          <LocationSelector
            currentLocation={currentLocation}
            onLocationChange={(location) => setCurrentLocation(location.name)}
          />
          <button
            onClick={() => window.location.href = '/profile'}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform active:scale-95 dark:bg-[#1A2E22]"
          >
            {userAvatar.startsWith('data:') ? (
              <img src={userAvatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-2xl">{userAvatar}</span>
            )}
          </button>
        </header>

        {/* Main Content */}
        <main className="flex flex-col gap-6 p-4 max-w-7xl mx-auto w-full">
          {/* Alert Banner - Always visible */}
          <div className="w-full">
            <AlertBanner />
          </div>

          {/* HOME TAB */}
          {activeTab === 'home' && (
            <>
              {/* Desktop: 2-column layout, Mobile: single column */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hero AQI Card */}
                <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm dark:bg-[#1A2E22]">
                  <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
                  <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-primary/5 blur-3xl"></div>
                  <div className="relative z-10">
                    <AQISphere />
                  </div>
                </div>

                {/* AI Health Insights */}
                <div className="relative">
                  <MLPrediction currentAQI={currentAQI} userConditions={userConditions} />
                </div>
              </div>

              {/* Health Advice Section */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-text-primary dark:text-white">Health Advice</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div
                    onClick={() => setActiveTab('map')}
                    className="flex flex-col rounded-xl bg-white p-4 shadow-sm dark:bg-[#1A2E22] cursor-pointer hover:shadow-md transition-all hover:scale-105"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                      <span className="material-symbols-outlined">directions_run</span>
                    </div>
                    <h4 className="mb-1 text-base font-bold text-text-primary dark:text-white">Outdoor Sports</h4>
                    <p className="text-sm text-text-secondary">Check AQI before exercising outdoors.</p>
                  </div>
                  <div
                    onClick={() => setActiveTab('symptoms')}
                    className="flex flex-col rounded-xl bg-white p-4 shadow-sm dark:bg-[#1A2E22] cursor-pointer hover:shadow-md transition-all hover:scale-105"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/30 text-primary dark:bg-primary/20">
                      <span className="material-symbols-outlined">masks</span>
                    </div>
                    <h4 className="mb-1 text-base font-bold text-text-primary dark:text-white">Breathing Health</h4>
                    <p className="text-sm text-text-secondary">Log symptoms to track your health.</p>
                  </div>
                  <div
                    onClick={() => {
                      // Show air quality recommendations
                      const aqiLevel = currentAQI || 50;
                      if (aqiLevel > 100) {
                        alert('⚠️ Current AQI is ' + aqiLevel + '. Keep windows closed and use air purifier if available.');
                      } else {
                        alert('✅ Current AQI is ' + aqiLevel + '. Great time to open windows and let fresh air in!');
                      }
                    }}
                    className="flex flex-col rounded-xl bg-white p-4 shadow-sm dark:bg-[#1A2E22] cursor-pointer hover:shadow-md transition-all hover:scale-105"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                      <span className="material-symbols-outlined">window</span>
                    </div>
                    <h4 className="mb-1 text-base font-bold text-text-primary dark:text-white">Ventilation</h4>
                    <p className="text-sm text-text-secondary">Open windows when air quality is good.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* LOG SYMPTOMS TAB */}
          {activeTab === 'symptoms' && (
            <>
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-text-primary dark:text-white">Log Your Symptoms</h2>
                <SymptomLog />
              </div>
            </>
          )}

          {/* MAP TAB */}
          {activeTab === 'map' && (
            <>
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-text-primary dark:text-white">Live Air Quality Map</h2>

                {/* Full Map View */}
                <div className="relative h-96 w-full overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
                    <div className="absolute top-1/4 left-1/4 w-24 h-24 rounded-full bg-primary/20 blur-2xl"></div>
                    <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-green-200/30 blur-3xl"></div>
                    <div className="absolute bottom-1/4 left-1/2 w-28 h-28 rounded-full bg-primary/15 blur-2xl"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8">
                        <span className="material-symbols-outlined text-6xl text-primary mb-2 block">explore</span>
                        <p className="text-sm font-bold text-text-primary dark:text-white">{currentLocation}</p>
                        <p className="text-xs text-text-secondary">Your neighborhood air quality</p>
                      </div>
                    </div>
                  </div>

                  {/* Map overlay */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-white/90 p-2 shadow-sm backdrop-blur-sm dark:bg-[#102218]/90">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    <span className="text-xs font-bold text-text-primary dark:text-white">Excellent Air Quality</span>
                  </div>
                </div>

                {/* Travel Routes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border-2 border-primary bg-primary/10 dark:bg-primary/20 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">route</span>
                        <h4 className="font-bold text-text-primary dark:text-white">Golden Gate Park</h4>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full border border-primary font-semibold text-primary bg-white dark:bg-background-dark">AQI 28</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">2.5 mi</span>
                      <span className="text-primary font-medium">Excellent Air</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A2E22] shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">route</span>
                        <h4 className="font-bold text-text-primary dark:text-white">Marina District</h4>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full border border-primary font-semibold text-primary bg-primary/10">AQI 35</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">3.2 mi</span>
                      <span className="text-primary font-medium">Good Air</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TRAVEL PLAN TAB */}
          {activeTab === 'travel' && (
            <>
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-text-primary dark:text-white">Plan Your Travel</h2>

                {/* Destination Selector */}
                <div className="bg-white dark:bg-[#1A2E22] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-text-primary dark:text-white mb-4">Where do you want to go?</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">From</label>
                      <div className="flex items-center gap-2 p-3 bg-background-light dark:bg-background-dark rounded-lg border border-gray-200 dark:border-gray-700">
                        <span className="material-symbols-outlined text-primary">my_location</span>
                        <span className="text-text-primary dark:text-white font-medium">{currentLocation}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">To</label>
                      <select className="w-full p-3 bg-white dark:bg-background-dark text-text-primary dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Golden Gate Park</option>
                        <option>Marina District</option>
                        <option>Downtown SF</option>
                        <option>Mission Bay</option>
                        <option>Fisherman's Wharf</option>
                        <option>Presidio</option>
                      </select>
                    </div>

                    <button className="w-full bg-primary text-text-primary dark:text-background-dark px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">route</span>
                      Find Clean Air Routes
                    </button>
                  </div>
                </div>

                {/* Map Preview */}
                <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
                    {/* Decorative map elements */}
                    <div className="absolute top-1/4 left-1/4 w-24 h-24 rounded-full bg-primary/20 blur-2xl"></div>
                    <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-green-200/30 blur-3xl"></div>
                    <div className="absolute bottom-1/4 left-1/2 w-28 h-28 rounded-full bg-primary/15 blur-2xl"></div>

                    {/* Map content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8 bg-white/80 dark:bg-[#1A2E22]/80 backdrop-blur-sm rounded-2xl shadow-lg">
                        <span className="material-symbols-outlined text-6xl text-primary mb-4 block">explore</span>
                        <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">Route Map</h3>
                        <p className="text-text-secondary text-sm max-w-md">
                          Select a destination to see the cleanest air quality routes
                        </p>
                      </div>
                    </div>

                    {/* Map indicators */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <div className="bg-white/95 dark:bg-[#1A2E22]/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-xs font-medium text-text-primary dark:text-white">Clean Route</span>
                      </div>
                      <div className="bg-white/95 dark:bg-[#1A2E22]/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-xs font-medium text-text-primary dark:text-white">Moderate</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Routes */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-bold text-text-primary dark:text-white">Recommended Routes</h3>

                  <div className="space-y-3">
                    {/* Route 1 */}
                    <div className="p-4 rounded-xl border-2 border-primary bg-primary/10 dark:bg-primary/20 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-2xl">route</span>
                          <div>
                            <h4 className="font-bold text-text-primary dark:text-white">Route A - Waterfront Path</h4>
                            <p className="text-xs text-text-secondary">Via Embarcadero</p>
                          </div>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full border-2 border-primary font-bold text-primary bg-white dark:bg-background-dark">AQI 28</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-text-secondary block text-xs">Distance</span>
                          <span className="text-text-primary dark:text-white font-semibold">2.5 mi</span>
                        </div>
                        <div>
                          <span className="text-text-secondary block text-xs">Time</span>
                          <span className="text-text-primary dark:text-white font-semibold">12 min</span>
                        </div>
                        <div>
                          <span className="text-text-secondary block text-xs">Air Quality</span>
                          <span className="text-primary font-semibold">Excellent</span>
                        </div>
                      </div>
                    </div>

                    {/* Route 2 */}
                    <div className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A2E22] shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-2xl">route</span>
                          <div>
                            <h4 className="font-bold text-text-primary dark:text-white">Route B - Direct Highway</h4>
                            <p className="text-xs text-text-secondary">Via I-80</p>
                          </div>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full border border-yellow-500 font-bold text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">AQI 65</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-text-secondary block text-xs">Distance</span>
                          <span className="text-text-primary dark:text-white font-semibold">1.8 mi</span>
                        </div>
                        <div>
                          <span className="text-text-secondary block text-xs">Time</span>
                          <span className="text-text-primary dark:text-white font-semibold">8 min</span>
                        </div>
                        <div>
                          <span className="text-text-secondary block text-xs">Air Quality</span>
                          <span className="text-yellow-700 dark:text-yellow-400 font-semibold">Moderate</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Travel Tips */}
                <div className="bg-primary/10 dark:bg-primary/20 border border-primary rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">lightbulb</span>
                    <div>
                      <h4 className="font-bold text-text-primary dark:text-white mb-2">Travel Tips</h4>
                      <ul className="space-y-1 text-sm text-text-secondary">
                        <li>• Travel during early morning (6-8 AM) for best air quality</li>
                        <li>• Avoid peak traffic hours to reduce pollution exposure</li>
                        <li>• Choose routes near parks and waterfronts when possible</li>
                        <li>• Check real-time AQI before starting your journey</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* COMMUNITY TAB */}
          {activeTab === 'community' && (
            <>
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-text-primary dark:text-white">Community & Care Team</h2>

                {/* Care Team Section */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-bold text-text-primary dark:text-white">My Care Team</h3>
                  <CareTeam />
                </div>

                {/* Share Data Quick Access */}
                <div className="bg-primary/10 dark:bg-primary/20 border border-primary rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-text-primary dark:text-background-dark">
                      <span className="material-symbols-outlined text-2xl">share</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary dark:text-white mb-2">Share Health Data</h3>
                      <p className="text-sm text-text-secondary mb-4">
                        Securely share your air quality exposure and symptom data with your care team.
                      </p>
                      <button
                        onClick={() => setShowShareModal(true)}
                        className="bg-primary text-text-primary dark:text-background-dark px-6 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90"
                      >
                        Share Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <>
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-text-primary dark:text-white">My Profile</h2>

                {/* Profile Card */}
                <div className="bg-white dark:bg-[#1A2E22] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-4xl border-2 border-primary">
                      {userAvatar.startsWith('data:') ? (
                        <img src={userAvatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span>{userAvatar}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-text-primary dark:text-white">{userName || 'Guest User'}</h3>
                      <p className="text-text-secondary">{currentLocation}</p>
                    </div>
                  </div>

                  {/* Health Conditions */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-text-primary dark:text-white">Health Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {userConditions.hasAsthma && (
                        <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">Asthma</span>
                      )}
                      {userConditions.hasCOPD && (
                        <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">COPD</span>
                      )}
                      {userConditions.hasAllergies && (
                        <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">Allergies</span>
                      )}
                      {!userConditions.hasAsthma && !userConditions.hasCOPD && !userConditions.hasAllergies && (
                        <span className="text-text-secondary text-sm">No conditions listed</span>
                      )}
                    </div>
                  </div>

                  {/* Profile Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    <button
                      onClick={() => window.location.href = '/profile'}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">edit</span>
                        <span className="font-medium text-text-primary dark:text-white">Edit Profile</span>
                      </div>
                      <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
                    </button>
                    <button
                      onClick={() => window.location.href = '/connect-device'}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">devices</span>
                        <span className="font-medium text-text-primary dark:text-white">Connected Devices</span>
                      </div>
                      <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="h-24 w-full"></div>
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-7xl border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-[#1A2E22]/95 backdrop-blur-md px-4 py-3 pb-safe">
          <ul className="flex items-center justify-around max-w-2xl mx-auto">
            <li className="flex flex-col items-center gap-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`group flex flex-col items-center transition-colors ${activeTab === 'home' ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0"}}>dashboard</span>
                <span className="text-[10px] font-medium">Home</span>
              </button>
            </li>
            <li className="flex flex-col items-center gap-1">
              <button
                onClick={() => setActiveTab('map')}
                className={`group flex flex-col items-center transition-colors ${activeTab === 'map' ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: activeTab === 'map' ? "'FILL' 1" : "'FILL' 0"}}>map</span>
                <span className="text-[10px] font-medium">Map</span>
              </button>
            </li>
            <li className="flex flex-col items-center gap-1">
              <button
                onClick={() => setActiveTab('symptoms')}
                className={`group flex flex-col items-center transition-colors ${activeTab === 'symptoms' ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: activeTab === 'symptoms' ? "'FILL' 1" : "'FILL' 0"}}>add_circle</span>
                <span className="text-[10px] font-medium">Log</span>
              </button>
            </li>
            <li className="flex flex-col items-center gap-1">
              <button
                onClick={() => setActiveTab('travel')}
                className={`group flex flex-col items-center transition-colors ${activeTab === 'travel' ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: activeTab === 'travel' ? "'FILL' 1" : "'FILL' 0"}}>luggage</span>
                <span className="text-[10px] font-medium">Travel</span>
              </button>
            </li>
            <li className="flex flex-col items-center gap-1">
              <button
                onClick={() => setActiveTab('community')}
                className={`group flex flex-col items-center transition-colors ${activeTab === 'community' ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: activeTab === 'community' ? "'FILL' 1" : "'FILL' 0"}}>groups</span>
                <span className="text-[10px] font-medium">Community</span>
              </button>
            </li>
            <li className="flex flex-col items-center gap-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`group flex flex-col items-center transition-colors ${activeTab === 'profile' ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0"}}>person</span>
                <span className="text-[10px] font-medium">Profile</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* AI Assistant Callout */}
        {showAICallout && (
          <div className="fixed bottom-28 right-4 z-40 max-w-xs animate-bounce-slow">
            <div className="relative bg-white dark:bg-[#1A2E22] rounded-2xl p-4 shadow-2xl border-2 border-primary">
              <button
                onClick={() => setShowAICallout(false)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-text-primary dark:text-background-dark rounded-full text-xs hover:bg-primary/80 transition-colors flex items-center justify-center font-bold"
              >
                ✕
              </button>
              <p className="text-primary text-sm font-bold leading-relaxed">
                💬 Use the AI assistant to understand your report better!
              </p>
            </div>
          </div>
        )}
      </div>

      <ChatBot />
      <ShareDataModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />

      {/* Full Screen AQI Alert */}
      {showFullScreenAlert && currentAQI && (
        <FullScreenAQIAlert
          aqi={currentAQI}
          onDismiss={handleDismissAlert}
          userConditions={userConditions}
        />
      )}

      {/* Testing Button - Remove in production */}
      <AQITestButton onTriggerAlert={handleTestAlert} />

      {/* Running Avatar Animation */}
      <RunningAvatar />
    </>
  );
}

export default Dashboard;
