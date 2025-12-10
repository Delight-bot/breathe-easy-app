import React, { useState, useEffect } from "react";
import AlertBanner from "../components/AlertBanner";
import AQICard from "../components/AQICard";
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
    <div className="min-h-screen bg-gray-900 p-4 relative" style={{
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(/images/Breath2.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-4xl font-bold text-white">
              Breathe Easy
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowShareModal(true)}
              className="bg-white hover:bg-gray-200 hover:scale-105 text-black px-5 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-md text-base"
              title="Share your health data"
            >
              Share Data
            </button>
            <button
              onClick={() => window.location.href = '/profile'}
              className="flex items-center space-x-2 hover:bg-gray-700 hover:scale-105 px-4 py-3 rounded-lg transition-all"
              title="View and edit profile"
            >
              <span className="text-white font-medium text-lg">{userName || 'Guest'}</span>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-md">
                {userAvatar.startsWith('data:') ? (
                  <img src={userAvatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span>{userAvatar}</span>
                )}
              </div>
            </button>
          </div>
        </div>

        <AlertBanner />
        <AQICard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          <div className="p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-105 transition-all bg-black border border-white border-opacity-20"
               onClick={() => window.location.href = '/log-symptoms'}>
            <h3 className="text-lg font-semibold text-white mb-2">Log Symptoms</h3>
            <p className="text-gray-300 text-base">Track your symptoms</p>
          </div>

          <div className="p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-105 transition-all bg-black border border-white border-opacity-20"
               onClick={() => window.location.href = '/connect-device'}>
            <h3 className="text-lg font-semibold text-white mb-2">Connect Device</h3>
            <p className="text-gray-300 text-base">Pair your Bluetooth device</p>
          </div>

          <div className="p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-105 transition-all bg-black border border-white border-opacity-20"
               onClick={() => window.location.href =='/doctor'}>
            <h3 className="text-lg font-semibold text-white mb-2">Contact Doctor</h3>
            <p className="text-gray-300 text-base">Message your provider</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <MLPrediction currentAQI={currentAQI} userConditions={userConditions} />
          <CareTeam />
        </div>
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
  );
}

export default Dashboard;
