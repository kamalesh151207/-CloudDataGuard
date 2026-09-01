import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

export default function StatusBadge({ status = 'verified', showIcon = true, size = 'normal' }) {
  const statusConfig = {
    verified: {
      label: 'Verified',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60 shadow-sm',
      dot: 'bg-emerald-500',
      icon: CheckCircle2,
    },
    redundant: {
      label: 'Redundant',
      bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/60 shadow-sm',
      dot: 'bg-rose-500',
      icon: XCircle,
    },
    invalid: {
      label: 'Invalid',
      bg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/60 shadow-sm',
      dot: 'bg-amber-500',
      icon: AlertTriangle,
    },
    unique: {
      label: 'Unique & Verified',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-800/60 shadow-sm',
      dot: 'bg-indigo-500 dark:bg-cyan-400',
      icon: CheckCircle2,
    }
  };

  const current = statusConfig[status?.toLowerCase()] || {
    label: status,
    bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
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
