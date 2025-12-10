import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConnectDevice() {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate device scanning
    setTimeout(() => {
      setDevices([
        { id: 1, name: 'Inhaler Tracker', type: 'Health Device' },
        { id: 2, name: 'Smartwatch Pro', type: 'Wearable' },
        { id: 3, name: 'Air Quality Monitor', type: 'Sensor' }
      ]);
      setIsScanning(false);
    }, 2000);
  };

  const handleConnect = (deviceName) => {
    setIsConnected(true);
    alert(`Connected to ${deviceName}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-lg shadow-xl p-8" style={{background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'}}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Connect Device</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Bluetooth Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
              </svg>
            </div>
          </div>

          {/* Connection Status */}
          <div className="text-center mb-6">
            {isConnected ? (
              <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                <p className="text-green-800 font-semibold text-lg">Connected!</p>
                <p className="text-green-600 text-sm mt-1">Your device is successfully paired</p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                <p className="text-red-800 font-semibold text-lg">Disconnected</p>
                <p className="text-red-600 text-sm mt-1">No devices are currently connected</p>
              </div>
            )}
          </div>

          {/* Scan Button */}
          <div className="mb-6">
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-colors shadow-md disabled:bg-gray-400"
            >
              {isScanning ? 'Scanning...' : 'Scan for Devices'}
            </button>
          </div>

          {/* Available Devices */}
          {devices.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Devices</h3>
              <div className="space-y-3">
                {devices.map(device => (
                  <div key={device.id} className="bg-blue-50 p-4 rounded-lg flex justify-between items-center border border-blue-200">
                    <div>
                      <p className="font-semibold text-gray-800">{device.name}</p>
                      <p className="text-sm text-gray-600">{device.type}</p>
                    </div>
                    <button
                      onClick={() => handleConnect(device.name)}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accessibility */}
          <div className="mt-6 text-center">
            <button className="text-blue-600 font-semibold hover:text-blue-700 transition">
              Accessibility
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
