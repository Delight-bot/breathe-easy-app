import React, { useState } from 'react';

function AvatarSelector({ selectedAvatar, onAvatarChange }) {
  const [previewUrl, setPreviewUrl] = useState(selectedAvatar || '');

  const defaultAvatars = [
    { id: 1, emoji: '👤', label: 'Default' },
    { id: 2, emoji: '😊', label: 'Happy' },
    { id: 3, emoji: '🧑', label: 'Person' },
    { id: 4, emoji: '👨', label: 'Man' },
    { id: 5, emoji: '👩', label: 'Woman' },
    { id: 6, emoji: '🧒', label: 'Child' },
    { id: 7, emoji: '👴', label: 'Elder' },
    { id: 8, emoji: '👵', label: 'Grandmother' },
  ];

  const handleAvatarClick = (emoji) => {
    setPreviewUrl(emoji);
    onAvatarChange({ type: 'emoji', value: emoji });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        onAvatarChange({ type: 'upload', value: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose Your Avatar
        </label>
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-4xl shadow-lg">
            {previewUrl ? (
              previewUrl.startsWith('data:') ? (
                <img src={previewUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>{previewUrl}</span>
              )
            ) : (
              <span>👤</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {defaultAvatars.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            onClick={() => handleAvatarClick(avatar.emoji)}
            className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
              previewUrl === avatar.emoji
                ? 'border-green-600 bg-green-50'
                : 'border-gray-300 hover:border-green-400'
            }`}
          >
            <div className="text-3xl">{avatar.emoji}</div>
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label
          htmlFor="avatar-upload"
          className="block w-full text-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition"
        >
          <span className="text-sm text-gray-600">
            📸 Or upload your own photo
          </span>
        </label>
      </div>
    </div>
  );
}

export default AvatarSelector;
