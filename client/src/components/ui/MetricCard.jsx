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
      border: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      badge: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/40',
      glow: 'shadow-glow-cyan'
    },
    emerald: {
      border: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      badge: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40',
      glow: 'shadow-glow-emerald'
    },
    rose: {
      border: 'border-rose-500/30',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      badge: 'bg-rose-950/60 text-rose-400 border-rose-800/40',
      glow: 'shadow-glow-rose'
    },
    amber: {
      border: 'border-amber-500/30',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      badge: 'bg-amber-950/60 text-amber-400 border-amber-800/40',
      glow: 'shadow-glow-amber'
    }
  };

  const currentTheme = colorMap[color] || colorMap.cyan;

  return (
    <div className={`p-5 bg-slate-900/60 border ${currentTheme.border} rounded-2xl backdrop-blur-xl shadow-xl transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </span>
          <h3 className="text-2xl font-extrabold text-white tracking-tight mt-1.5 font-mono">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
        </div>

        <div className={`p-3 rounded-xl border ${currentTheme.iconBg} ${currentTheme.glow}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 truncate max-w-[170px]">
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
