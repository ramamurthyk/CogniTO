
import React from 'react';
import { COLOR_PALETTE } from '../constants';

interface CircularProgressProps {
  score: number; // Percentage from 0 to 100
  label: string;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ score, label, className }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const currentPrimaryColor = document.body.classList.contains('dark') ? COLOR_PALETTE.primaryDark : COLOR_PALETTE.primary;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-border dark:text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className="transition-all duration-700 ease-in-out"
            strokeWidth="8"
            stroke={currentPrimaryColor}
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>
        <span className="absolute text-score font-mono font-bold text-secondary dark:text-primary-dark">
          {Math.round(score)}%
        </span>
      </div>
      <p className="mt-3 text-label font-medium text-textDark dark:text-textLight text-center">{label}</p>
    </div>
  );
};

export default CircularProgress;
