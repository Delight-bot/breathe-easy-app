import React from 'react';

function ProgressBar({ currentStep, totalSteps }) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-green-600 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
