import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  percentage, 
  trend = 'neutral', 
  color = 'cyan',
  description
}) {
  const colorMap = {
    cyan: {
      border: 'border-slate-200 dark:border-cyan-500/30',
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/30',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-800/40',
      glow: 'shadow-sm'
    },
    emerald: {
      border: 'border-slate-200 dark:border-emerald-500/30',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/40',
      glow: 'shadow-sm'
    },
    rose: {
      border: 'border-slate-200 dark:border-rose-500/30',
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30',
      badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/40',
      glow: 'shadow-sm'
    },
    amber: {
      border: 'border-slate-200 dark:border-amber-500/30',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30',
      badge: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/40',
      glow: 'shadow-sm'
    }
  };

  const currentTheme = colorMap[color] || colorMap.cyan;

  return (
    <div className={`p-5 bg-white dark:bg-slate-900/60 border ${currentTheme.border} rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1.5 font-mono">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
        </div>

        <div className={`p-3 rounded-xl border ${currentTheme.iconBg} ${currentTheme.glow}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
          {description}
        </span>

        {percentage !== undefined && (
          <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${currentTheme.badge}`}>
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend === 'neutral' && <Minus className="w-3 h-3" />}
            <span>{percentage}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
