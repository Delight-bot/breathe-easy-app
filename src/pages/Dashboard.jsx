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
      `}</style>
      <div className="min-h-screen bg-gray-900 p-4 relative" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/images/Breath2.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-start mb-8">
          {/* AQI Sphere on far left */}
          <div>
            <AQISphere />
          </div>

          {/* Share Data button in middle */}
          <div className="flex-1 flex justify-center items-start pt-4">
            <button
              onClick={() => setShowShareModal(true)}
              className="bg-gray-800 hover:bg-gray-700 hover:scale-105 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-md text-base border border-gray-600"
              title="Share your health data"
            >
              Share Data
            </button>
          </div>

          {/* User profile on right */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.location.href = '/profile'}
              className="flex items-center space-x-2 hover:bg-gray-700 hover:scale-105 px-4 py-3 rounded-lg transition-all"
              title="View and edit profile"
            >
              <span className="text-white font-medium text-lg">{userName || 'Guest'}</span>
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl shadow-md border border-gray-600">
                {userAvatar.startsWith('data:') ? (
                  <img src={userAvatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span>{userAvatar}</span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="mb-8">
          <AlertBanner />
        </div>

        {/* Quick Actions - Orange Text on Black Cards */}
        <div className="mb-10 flex flex-wrap gap-6">
          <button
            onClick={() => window.location.href = '/log-symptoms'}
            className="px-8 py-4 bg-black border border-gray-700 rounded-lg text-2xl font-bold text-orange-500 hover:text-orange-400 hover:border-gray-600 hover:scale-105 transition-all cursor-pointer shadow-lg"
          >
            Log Symptoms
          </button>
          <button
            onClick={() => window.location.href = '/connect-device'}
            className="px-8 py-4 bg-black border border-gray-700 rounded-lg text-2xl font-bold text-orange-500 hover:text-orange-400 hover:border-gray-600 hover:scale-105 transition-all cursor-pointer shadow-lg"
          >
            Connect Device
          </button>
          <button
            onClick={() => window.location.href = '/doctor'}
            className="px-8 py-4 bg-black border border-gray-700 rounded-lg text-2xl font-bold text-orange-500 hover:text-orange-400 hover:border-gray-600 hover:scale-105 transition-all cursor-pointer shadow-lg"
          >
            Contact Doctor
          </button>
          <button
            onClick={() => window.location.href = '#care-team'}
            className="px-8 py-4 bg-black border border-gray-700 rounded-lg text-2xl font-bold text-orange-500 hover:text-orange-400 hover:border-gray-600 hover:scale-105 transition-all cursor-pointer shadow-lg"
          >
            My Care Team
          </button>
        </div>

        {/* AI Health Insights */}
        <div className="mb-8 relative">
          <MLPrediction currentAQI={currentAQI} userConditions={userConditions} />
        </div>

        {/* AI Assistant Callout */}
        {showAICallout && (
          <div className="fixed bottom-28 right-24 z-40 max-w-xs animate-bounce-slow">
            <div className="relative bg-black rounded-2xl p-4 shadow-2xl border-2 border-gray-700">
              <button
                onClick={() => setShowAICallout(false)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-700 text-white rounded-full text-xs hover:bg-gray-600 transition-colors flex items-center justify-center"
              >
                ✕
              </button>
              <p className="text-orange-500 text-sm font-bold leading-relaxed">
                💬 Use the AI assistant to understand your report better!
              </p>
              {/* Arrow pointing to chatbot (bottom-right) */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black border-r-2 border-b-2 border-gray-700 transform rotate-45"></div>
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
      </div>
    </>
  );
}

export default Dashboard;
