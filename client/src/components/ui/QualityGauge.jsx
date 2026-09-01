import React from 'react';

export default function QualityGauge({ score = 100, label = "Overall Data Quality" }) {
  const radius = 64;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let gaugeColor = '#059669'; // Emerald
  if (score < 70) {
    gaugeColor = '#e11d48'; // Rose
  } else if (score < 90) {
    gaugeColor = '#d97706'; // Amber
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm relative overflow-hidden group">
      {/* Background soft ambient light */}
      <div 
        className="absolute w-40 h-40 rounded-full blur-3xl opacity-10 dark:opacity-20 transition-all duration-700 group-hover:opacity-25"
        style={{ backgroundColor: gaugeColor }}
      />

      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            className="stroke-slate-200 dark:stroke-slate-800"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={gaugeColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
            {score}%
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
            Accuracy
          </span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Calculated dynamically from real database record stats
        </p>
      </div>
    </div>
  );
}
