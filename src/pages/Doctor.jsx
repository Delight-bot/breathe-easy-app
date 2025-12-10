import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Doctor() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Thank you for using our service. How would you rate our work?",
      rating: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedRating, setSelectedRating] = useState(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'user',
        text: inputMessage
      }]);
      setInputMessage('');

      // Simulate doctor response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'bot',
          text: "I'm reviewing your symptoms. What else can I do to help?"
        }]);
      }, 1000);
    }
  };

  const handleRating = (rating) => {
    setSelectedRating(rating);
    setMessages([...messages, {
      id: messages.length + 1,
      sender: 'user',
      text: `I'm sneezing and my head hurts. What can I do to feel better?`
    }]);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-200 flex flex-col" style={{height: '85vh'}}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-800 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                👨‍⚕️
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Doctor</h1>
                <p className="text-gray-300 text-sm">Online</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white hover:bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Back
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md ${message.sender === 'user' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl p-4`}>
                  <p className="text-sm">{message.text}</p>

                  {message.rating && !selectedRating && (
                    <div className="mt-4 flex gap-2 justify-center">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRating(rating)}
                          className="w-10 h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-semibold transition-colors"
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-gray-700 focus:bg-white outline-none transition"
              />
              <button
                type="submit"
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
