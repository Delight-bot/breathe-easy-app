import React, { useState, useEffect, useRef } from 'react';

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I\'m Dr. Breathe, your respiratory health assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const doctorAvatar = '👨‍⚕️';

  const getUserAvatar = () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.avatar) {
      return userData.avatar.value;
    }
    return '👤';
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputText('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
      }]);
    }, 1000);
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();

    if (input.includes('symptom') || input.includes('breathing') || input.includes('cough')) {
      return 'I can help you track your symptoms. Have you noticed any patterns related to air quality or specific times of day? It\'s important to log your symptoms regularly.';
    } else if (input.includes('air quality') || input.includes('aqi')) {
      return 'Based on your location, I can monitor the air quality for you. Poor air quality days can trigger respiratory symptoms. Would you like me to enable notifications for unhealthy air days?';
    } else if (input.includes('medication') || input.includes('inhaler')) {
      return 'Remember to take your medication as prescribed. If you\'re experiencing increased symptoms, please consult with your healthcare provider. I can help you track when you use your inhaler.';
    } else if (input.includes('exercise') || input.includes('activity')) {
      return 'Exercise is great for respiratory health! I recommend checking the air quality before outdoor activities. Would you like tips for exercising safely with respiratory conditions?';
    } else {
      return 'I understand. As your respiratory health assistant, I can help you monitor air quality, track symptoms, and provide guidance. What specific concerns do you have today?';
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-600 text-white rounded-full shadow-2xl hover:bg-green-700 transition-all duration-300 flex items-center justify-center text-3xl z-50 hover:scale-110"
      >
        {isOpen ? '✕' : doctorAvatar}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-500 text-white p-4 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                {doctorAvatar}
              </div>
              <div>
                <h3 className="font-bold text-lg">Dr. Breathe</h3>
                <p className="text-xs opacity-90">Respiratory Health Assistant</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                    message.sender === 'bot'
                      ? 'bg-green-100'
                      : 'bg-blue-100'
                  }`}>
                    {message.sender === 'bot' ? doctorAvatar : getUserAvatar()}
                  </div>
                  <div>
                    <div className={`p-3 rounded-2xl ${
                      message.sender === 'bot'
                        ? 'bg-white border border-gray-200'
                        : 'bg-green-600 text-white'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 px-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition font-semibold"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatBot;
