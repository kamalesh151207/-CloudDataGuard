import React, { useState } from 'react';
import { 
  Search, 
  Database, 
  MapPin, 
  ShieldCheck, 
  User, 
  Sparkles, 
  Sun, 
  Moon, 
  Bell,
  LayoutDashboard,
  BarChart3,
  Activity,
  HeartPulse,
  Settings
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const menuItems = [
  { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
  { id: 'validation', label: 'DATA VALIDATION', icon: ShieldCheck },
  { id: 'records', label: 'RECORDS', icon: Database },
  { id: 'analytics', label: 'ANALYTICS', icon: BarChart3 },
  { id: 'logs', label: 'ACTIVITY LOGS', icon: Activity },
  { id: 'health', label: 'SYSTEM HEALTH', icon: HeartPulse },
  { id: 'settings', label: 'SETTINGS', icon: Settings },
];

export default function TopHeaderBuiltIn({ activeTab, setActiveTab, dbHealth, onRefreshHealth }) {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const isConnected = dbHealth?.isConnected ?? true;

  return (
    <header className="w-full flex flex-col sticky top-0 z-40 shadow-md">
      {/* Tier 1: Dark Midnight Navy BuiltIn Header */}
      <div className="bg-[#071330] text-white px-6 py-2.5 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#00a8e8] to-[#0055b8] flex items-center justify-center font-extrabold text-white text-lg shadow-md border border-cyan-400/40">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1 font-sans">
                CloudDataGuard
              </span>
              <span className="text-[10px] text-cyan-300 font-semibold tracking-wider uppercase">
                Uniting Cloud + Data.
              </span>
            </div>
          </div>
        </div>

        {/* Middle / Right Action Utilities */}
        <div className="flex items-center space-x-5">
          {/* Search Button */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-cyan-300 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cloud records & logs..."
              className="pl-9 pr-4 py-1.5 rounded-full bg-[#0c2357] text-white placeholder-cyan-200/60 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400 transition w-60 border border-cyan-500/20"
            />
          </div>

          {/* For Employers Button */}
          <button
            onClick={() => setActiveTab('validation')}
            className="px-4 py-1.5 rounded-md bg-[#2554d7] hover:bg-[#1d44b5] text-white font-extrabold text-xs tracking-wider uppercase transition shadow-sm"
          >
            For Enterprise
          </button>

          {/* User Links */}
          <div className="hidden sm:flex items-center space-x-2 text-xs font-bold tracking-wider uppercase text-cyan-100">
            <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('settings')}>LOG IN</span>
            <span>|</span>
            <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('validation')}>JOIN</span>
          </div>

          {/* Theme Quick Toggle */}
          <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-[#0c2357] border border-cyan-500/20">
            <button
              onClick={() => setTheme('builtin')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                theme === 'builtin' ? 'bg-[#00a8e8] text-white' : 'text-cyan-200/70 hover:text-white'
              }`}
              title="BuiltIn Ocean Theme"
            >
              Hub
            </button>
            <button
              onClick={() => setTheme('cyber')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                theme === 'cyber' ? 'bg-purple-600 text-white' : 'text-cyan-200/70 hover:text-white'
              }`}
              title="Cyber Amethyst Theme"
            >
              Cyber
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2: White BuiltIn Horizontal Navigation Bar */}
      <div className="bg-white text-slate-800 border-b border-slate-200 px-6 py-2 flex items-center justify-between text-xs font-bold tracking-wide">
        {/* Horizontal Navigation Tabs */}
        <nav className="flex items-center space-x-6 overflow-x-auto py-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`transition-colors whitespace-nowrap flex items-center gap-1.5 py-1 ${
                  isActive
                    ? 'text-[#0088cc] border-b-2 border-[#0088cc] font-extrabold'
                    : 'text-slate-700 hover:text-[#0088cc]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status & Location */}
        <div className="hidden lg:flex items-center space-x-4">
          <div 
            onClick={onRefreshHealth}
            className="flex items-center space-x-1.5 text-[#0088cc] font-bold cursor-pointer hover:underline"
          >
            <MapPin className="w-4 h-4 text-[#00a8e8]" />
            <span>FIND MY TECH HUB</span>
          </div>

          <div className="h-4 w-px bg-slate-300" />

          {/* Database Live Status */}
          <div 
            onClick={onRefreshHealth}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer border ${
              isConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span>{isConnected ? 'MongoDB Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
