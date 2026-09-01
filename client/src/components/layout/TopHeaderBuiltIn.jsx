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
  Settings,
  Droplets
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

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
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const isConnected = dbHealth?.isConnected ?? true;

  return (
    <header className="w-full flex flex-col sticky top-0 z-40 shadow-sm border-b border-slate-200">
      {/* Tier 1: Rich Dark Green Header (AquaSmart Style) */}
      <div className="bg-gradient-to-r from-[#052e16] via-[#14532d] to-[#047857] text-white px-6 py-2.5 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#16a34a] to-[#059669] flex items-center justify-center font-extrabold text-white text-lg shadow-md border border-emerald-400/40">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1 font-sans">
                Aqua<span className="text-[#86efac]">Data</span>Guard <span className="text-[10px] bg-[#22c55e]/20 text-[#86efac] border border-[#4ade80]/40 px-1.5 py-0.5 rounded font-mono font-bold">AI</span>
              </span>
              <span className="text-[10px] text-emerald-200 font-medium tracking-wider uppercase">
                Smart Water Management for Cloud Data Quality.
              </span>
            </div>
          </div>
        </div>

        {/* Middle / Right Action Utilities */}
        <div className="flex items-center space-x-5">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-emerald-300 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search data quality & AI telemetry..."
              className="pl-9 pr-4 py-1.5 rounded-full bg-[#166534]/60 text-white placeholder-emerald-200/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#4ade80] transition w-64 border border-emerald-400/30"
            />
          </div>

          {/* For Enterprise Button */}
          <button
            onClick={() => setActiveTab('validation')}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#16a34a] to-[#059669] hover:from-[#15803d] hover:to-[#047857] text-white font-extrabold text-xs tracking-wider uppercase transition shadow-md border border-emerald-400/30"
          >
            Launch AI Engine
          </button>

          {/* User Links / Authentication State */}
          <div className="hidden sm:flex items-center space-x-2 text-xs font-bold tracking-wider uppercase text-emerald-100">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-[#86efac] font-extrabold normal-case flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-200" /> {user?.name || 'Cloud Admin'}
                </span>
                <span>|</span>
                <span 
                  onClick={() => {
                    logout();
                    setActiveTab('overview');
                  }} 
                  className="hover:text-white cursor-pointer text-rose-300 font-bold"
                >
                  LOG OUT
                </span>
              </div>
            ) : (
              <>
                <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('login')}>LOG IN</span>
                <span>|</span>
                <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('login')}>JOIN</span>
              </>
            )}
          </div>

          {/* Theme Quick Toggle */}
          <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-[#166534]/60 border border-emerald-400/30">
            <button
              onClick={() => setTheme('aquasmart')}
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                theme === 'aquasmart' ? 'bg-[#16a34a] text-white shadow-sm' : 'text-emerald-200/70 hover:text-white'
              }`}
              title="AquaSmart AI Green Theme"
            >
              Aqua
            </button>
            <button
              onClick={() => setTheme('bluewhite')}
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                theme === 'bluewhite' ? 'bg-[#0052cc] text-white shadow-sm' : 'text-emerald-200/70 hover:text-white'
              }`}
              title="Royal Blue Theme"
            >
              Blue
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2: Pure White AquaSmart Navigation Bar */}
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
                    ? 'text-[#15803d] border-b-2 border-[#16a34a] font-extrabold'
                    : 'text-slate-600 hover:text-[#15803d]'
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
            className="flex items-center space-x-1.5 text-[#15803d] font-bold cursor-pointer hover:underline"
          >
            <MapPin className="w-4 h-4 text-[#16a34a]" />
            <span>FIND MY TECH HUB</span>
          </div>

          <div className="h-4 w-px bg-slate-300" />

          {/* Database Live Status */}
          <div 
            onClick={onRefreshHealth}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer border ${
              isConnected
                ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#22c55e] animate-pulse' : 'bg-rose-500'}`} />
            <span>{isConnected ? 'MongoDB Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
