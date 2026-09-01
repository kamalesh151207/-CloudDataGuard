import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

export default function StatusBadge({ status = 'verified', showIcon = true, size = 'normal' }) {
  const statusConfig = {
    verified: {
      label: 'Verified',
      bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60 shadow-glow-emerald',
      dot: 'bg-emerald-400',
      icon: CheckCircle2,
    },
    redundant: {
      label: 'Redundant',
      bg: 'bg-rose-950/60 text-rose-400 border-rose-800/60 shadow-glow-rose',
      dot: 'bg-rose-500',
      icon: XCircle,
    },
    invalid: {
      label: 'Invalid',
      bg: 'bg-amber-950/60 text-amber-400 border-amber-800/60 shadow-glow-amber',
      dot: 'bg-amber-400',
      icon: AlertTriangle,
    },
    unique: {
      label: 'Unique & Verified',
      bg: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60 shadow-glow-cyan',
      dot: 'bg-cyan-400',
      icon: CheckCircle2,
    }
  };

  const current = statusConfig[status?.toLowerCase()] || {
    label: status,
    bg: 'bg-slate-800 text-slate-300 border-slate-700',
    dot: 'bg-slate-400',
    icon: HelpCircle,
  };

  const IconComponent = current.icon;
  const paddingClass = size === 'small' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center space-x-1.5 rounded-full font-semibold border ${current.bg} ${paddingClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} animate-pulse`} />
      {showIcon && <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />}
      <span className="capitalize">{current.label}</span>
    </span>
  );
}
