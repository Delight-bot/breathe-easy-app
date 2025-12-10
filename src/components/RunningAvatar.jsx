import React, { useState, useEffect } from 'react';

export default function RunningAvatar() {
  const [isVisible, setIsVisible] = useState(true);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    // Check if animation has already run in this session
    const animationPlayed = sessionStorage.getItem('runningAvatarPlayed');

    if (animationPlayed) {
      setIsVisible(false);
      setHasRun(true);
      return;
    }

    // Hide the avatar after animation completes (5 seconds)
    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('runningAvatarPlayed', 'true');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div className="running-avatar">
        {/* Avatar character */}
        <div className="flex items-end">
          {/* Person running */}
          <div className="relative">
            <div className="text-6xl animate-bounce-slight">
              🏃
            </div>
          </div>

          {/* Flag */}
          <div className="ml-4 relative">
            <div className="flag-pole bg-gray-800 w-1 h-24 absolute bottom-0 left-0"></div>
            <div className="flag bg-white px-4 py-2 rounded shadow-lg border-2 border-gray-800 animate-wave">
              <span className="text-lg font-bold text-black whitespace-nowrap">
                Breathe Easy
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .running-avatar {
          position: absolute;
          bottom: 20%;
          right: -200px;
          animation: runAcross 5s linear forwards;
          display: flex;
          align-items: flex-end;
          transform: scaleX(-1);
        }

        @keyframes runAcross {
          0% {
            right: -200px;
          }
          100% {
            right: calc(100% + 200px);
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        @keyframes bounce-slight {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-wave {
          animation: wave 0.5s ease-in-out infinite;
        }

        .animate-bounce-slight {
          animation: bounce-slight 0.3s ease-in-out infinite;
        }

        .flag {
          position: absolute;
          bottom: 40px;
          left: 8px;
          transform-origin: bottom left;
        }

        .flag-pole {
          z-index: -1;
        }
      `}</style>
    </div>
  );
}
