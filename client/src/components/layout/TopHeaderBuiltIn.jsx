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
  Zap
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
    <header className="w-full flex flex-col sticky top-0 z-40 shadow-[0_4px_30px_rgba(255,0,128,0.2)]">
      {/* Tier 1: Cyberpunk Midnight Synthwave Header */}
      <div className="bg-[#050010] text-white px-6 py-2.5 flex items-center justify-between border-b border-pink-500/20">
        {/* Left Branding */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff007f] via-[#b5179e] to-[#00f0ff] flex items-center justify-center font-extrabold text-white text-lg shadow-[0_0_15px_rgba(255,0,128,0.6)] border border-pink-400/50">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-wider text-white flex items-center gap-1 font-sans">
                Cloud<span className="text-[#00f0ff]">Data</span><span className="text-[#ff007f]">Guard</span>
              </span>
              <span className="text-[10px] text-pink-400 font-bold tracking-widest uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#00f0ff]" /> Cyberpunk Redundancy Engine
              </span>
            </div>
          </div>
        </div>

        {/* Middle / Right Action Utilities */}
        <div className="flex items-center space-x-5">
          {/* Search Button */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-[#00f0ff] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search synthwave cloud records..."
              className="pl-9 pr-4 py-1.5 rounded-full bg-[#0e0324] text-white placeholder-pink-300/40 text-xs focus:outline-none focus:ring-2 focus:ring-[#00f0ff] transition w-60 border border-pink-500/30"
            />
          </div>

          {/* For Enterprise Button */}
          <button
            onClick={() => setActiveTab('validation')}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#00f0ff] text-slate-950 font-black text-xs tracking-wider uppercase transition shadow-[0_0_20px_rgba(255,0,128,0.5)] hover:scale-105"
          >
            ENTERPRISE ENGINE
          </button>

          {/* User Links / Authentication State */}
          <div className="hidden sm:flex items-center space-x-2 text-xs font-bold tracking-wider uppercase text-pink-200">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-[#00f0ff] font-extrabold normal-case flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#ff007f]" /> {user?.name || 'Cyber Admin'}
                </span>
                <span>|</span>
                <span 
                  onClick={() => {
                    logout();
                    setActiveTab('overview');
                  }} 
                  className="hover:text-pink-400 cursor-pointer text-pink-400 font-bold"
                >
                  LOG OUT
                </span>
              </div>
            ) : (
              <>
                <span className="hover:text-[#00f0ff] cursor-pointer" onClick={() => setActiveTab('login')}>LOG IN</span>
                <span>|</span>
                <span className="hover:text-[#00f0ff] cursor-pointer" onClick={() => setActiveTab('login')}>JOIN</span>
              </>
            )}
          </div>

          {/* Theme Quick Toggle */}
          <div className="flex items-center space-x-1 p-0.5 rounded-xl bg-[#0e0324] border border-pink-500/30">
            <button
              onClick={() => setTheme('cyberpunk')}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase transition ${
                theme === 'cyberpunk' ? 'bg-gradient-to-r from-[#ff007f] to-[#00f0ff] text-slate-950 shadow-sm' : 'text-pink-300/70 hover:text-white'
              }`}
              title="Vibrant Cyberpunk Theme"
            >
              Neon
            </button>
            <button
              onClick={() => setTheme('builtin')}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase transition ${
                theme === 'builtin' ? 'bg-[#0088cc] text-white' : 'text-pink-300/70 hover:text-white'
              }`}
              title="BuiltIn Ocean Theme"
            >
              Hub
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2: Dark Synthwave Amethyst Bar */}
      <div className="bg-[#0b031b] text-white border-b border-pink-500/20 px-6 py-2 flex items-center justify-between text-xs font-bold tracking-wider">
        {/* Horizontal Navigation Tabs */}
        <nav className="flex items-center space-x-6 overflow-x-auto py-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`transition-all whitespace-nowrap flex items-center gap-1.5 py-1 ${
                  isActive
                    ? 'text-[#00f0ff] border-b-2 border-[#ff007f] font-extrabold drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]'
                    : 'text-slate-400 hover:text-pink-300'
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
            className="flex items-center space-x-1.5 text-[#00f0ff] font-bold cursor-pointer hover:underline"
          >
            <MapPin className="w-4 h-4 text-[#ff007f]" />
            <span>NEON CLOUD HUB</span>
          </div>

          <div className="h-4 w-px bg-pink-500/30" />

          {/* Database Live Status */}
          <div 
            onClick={onRefreshHealth}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer border ${
              isConnected
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-rose-950/80 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse shadow-glow-emerald' : 'bg-rose-500'}`} />
            <span>{isConnected ? 'MongoDB Atlas Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
