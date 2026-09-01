import React, { useState } from 'react';
import { 
  Bell, 
  Sun, 
  Moon, 
  User, 
  Database, 
  ChevronDown, 
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const pageDescriptions = {
  overview: {
    title: 'Overview Dashboard',
    desc: 'Monitor real-time cloud data quality, deduplication statistics, and active metrics.'
  },
  validation: {
    title: 'Data Validation Engine',
    desc: 'Validate new incoming records against schema rules and multi-level database duplicate checks.'
  },
  records: {
    title: 'Cloud Record Store',
    desc: 'Browse, search, and manage unique verified records stored in MongoDB Atlas.'
  },
  analytics: {
    title: 'Data Quality Analytics',
    desc: 'Comprehensive visual analysis of redundancy trends, validation rates, and error causes.'
  },
  logs: {
    title: 'Audit & Activity Logs',
    desc: 'Immutable timeline feed of data validation events, duplicate rejections, and system logs.'
  },
  health: {
    title: 'System Health Diagnostics',
    desc: 'Real-time operational status of MongoDB Atlas, Express API, uptime, and latency.'
  },
  settings: {
    title: 'Engine Configuration',
    desc: 'Manage deduplication strictness, normalization options, and workspace preferences.'
  }
};

export default function TopBar({ activeTab, dbHealth, onRefreshHealth }) {
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const pageInfo = pageDescriptions[activeTab] || {
    title: 'CloudDataGuard',
    desc: 'Validate. Deduplicate. Trust Your Data.'
  };

  const isConnected = dbHealth?.isConnected ?? true;

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#090d16]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-6 py-3.5 flex items-center justify-between transition-colors duration-200">
      {/* Left Title & Description */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          {pageInfo.title}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl">
          {pageInfo.desc}
        </p>
      </div>

      {/* Right Connection Status & Controls */}
      <div className="flex items-center space-x-3">
        {/* Database Status Indicator */}
        <div 
          onClick={onRefreshHealth}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
            isConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50 hover:bg-emerald-100'
              : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50 hover:bg-rose-100'
          }`}
          title="Click to refresh MongoDB Atlas health check"
        >
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <Database className="w-3.5 h-3.5" />
          <span>{isConnected ? 'MongoDB Connected' : 'DB Disconnected'}</span>
          {dbHealth?.isInMemory && (
            <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-cyan-900/60 dark:text-cyan-300 px-1.5 py-0.5 rounded font-mono font-bold">
              InMemory
            </span>
          )}
        </div>

        {/* Multi-Theme Selector */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setTheme('light')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              theme === 'light'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
            title="Light Theme"
          >
            <Sun className="w-3 h-3 text-amber-500" />
            <span className="hidden lg:inline">Light</span>
          </button>

          <button
            onClick={() => setTheme('cyber')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              theme === 'cyber'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
            title="Cyber Theme"
          >
            <Sparkles className="w-3 h-3 text-purple-300" />
            <span className="hidden lg:inline">Cyber</span>
          </button>

          <button
            onClick={() => setTheme('navy')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              theme === 'navy'
                ? 'bg-gradient-to-r from-cyan-600 to-emerald-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
            title="Deep Navy Theme"
          >
            <Moon className="w-3 h-3 text-cyan-300" />
            <span className="hidden lg:inline">Navy</span>
          </button>
        </div>

        {/* Notifications Icon Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 dark:bg-cyan-400" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Engine Notifications</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-600 dark:bg-cyan-950 dark:text-cyan-400 px-2 py-0.5 rounded-full font-semibold">Active</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/60 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-200">Atlas Engine Protection Active</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Unique compound indexes on normalized email & phone enforcing 0-redundancy.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 p-1.5 pr-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-sm transition"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-sm">
              CD
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline">Cloud Admin</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-200">CodeAlpha Evaluator</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">admin@clouddataguard.io</p>
              </div>
              <div className="text-xs space-y-1">
                <div className="px-2 py-1.5 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                  Role: Cloud Security Engineer
                </div>
                <div className="px-2 py-1.5 text-indigo-600 dark:text-emerald-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer font-mono text-[11px] font-bold">
                  Task 1: Redundancy Engine
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
