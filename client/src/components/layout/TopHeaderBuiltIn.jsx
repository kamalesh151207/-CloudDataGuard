import React from 'react';
import { 
  Search, 
  Database, 
  MapPin, 
  ShieldCheck, 
  User, 
  Sparkles, 
  LayoutDashboard,
  BarChart3,
  Activity,
  HeartPulse,
  Settings,
  ShieldAlert,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { id: 'landing', label: 'HOME LANDING', icon: Sparkles },
  { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
  { id: 'validation', label: 'DATA VALIDATION', icon: ShieldCheck },
  { id: 'records', label: 'RECORDS', icon: Database },
  { id: 'analytics', label: 'ANALYTICS', icon: BarChart3 },
  { id: 'logs', label: 'ACTIVITY LOGS', icon: Activity },
  { id: 'health', label: 'SYSTEM HEALTH', icon: HeartPulse },
  { id: 'settings', label: 'SETTINGS', icon: Settings },
];

export default function TopHeaderBuiltIn({ activeTab, setActiveTab, searchQuery, setSearchQuery, dbHealth, onRefreshHealth }) {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const isConnected = dbHealth?.isConnected ?? true;

  const handleSearchChange = (e) => {
    const query = e.target.value;
    if (setSearchQuery) setSearchQuery(query);
    if (query.trim().length > 0 && activeTab !== 'records') {
      setActiveTab('records');
    }
  };

  const handleClearSearch = () => {
    if (setSearchQuery) setSearchQuery('');
  };

  return (
    <header className="w-full flex flex-col sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Tier 1: Clean White Header with Royal Blue Button & Functional Search */}
      <div className="bg-white text-slate-900 px-6 py-3 flex items-center justify-between border-b border-slate-100">
        {/* Left Branding */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-9 h-9 rounded-xl bg-[#2563eb] flex items-center justify-center font-extrabold text-white text-lg shadow-sm">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-1 font-sans">
                CloudDataGuard
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                Enterprise Cloud Security & Deduplication
              </span>
            </div>
          </div>
        </div>

        {/* Middle / Right Action Utilities */}
        <div className="flex items-center space-x-5">
          {/* Functional Search Bar */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={handleSearchChange}
              placeholder="Search by name, email, phone..."
              className="pl-9 pr-8 py-1.5 rounded-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition w-72 border border-slate-200"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Royal Blue Button */}
          <button
            onClick={() => setActiveTab('validation')}
            className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs tracking-wider uppercase transition shadow-sm"
          >
            For Enterprise
          </button>

          {/* User Links / Authentication State */}
          <div className="hidden sm:flex items-center space-x-2 text-xs font-bold tracking-wider uppercase text-slate-700">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-[#2563eb] font-extrabold normal-case flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#2563eb]" /> {user?.name || 'Cloud Admin'}
                </span>
                <span className="text-slate-300">|</span>
                <span 
                  onClick={() => {
                    logout();
                    setActiveTab('overview');
                  }} 
                  className="hover:text-rose-600 cursor-pointer text-rose-500 font-bold"
                >
                  LOG OUT
                </span>
              </div>
            ) : (
              <>
                <span className="hover:text-[#2563eb] cursor-pointer" onClick={() => setActiveTab('login')}>LOG IN</span>
                <span className="text-slate-300">|</span>
                <span className="hover:text-[#2563eb] cursor-pointer" onClick={() => setActiveTab('login')}>JOIN</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tier 2: Pure White Navigation Bar with High-Visibility Active Tab Highlights */}
      <div className="bg-white text-slate-800 px-6 py-2 flex items-center justify-between text-xs font-bold tracking-wide border-b border-slate-200">
        {/* Horizontal Navigation Tabs with Active Highlights */}
        <nav className="flex items-center space-x-2 overflow-x-auto py-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`transition-all whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${
                  isActive
                    ? 'bg-[#2563eb] text-white font-extrabold shadow-sm'
                    : 'text-slate-600 hover:text-[#2563eb] hover:bg-slate-100 font-semibold'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status & Location */}
        <div className="hidden lg:flex items-center space-x-4">
          <div 
            onClick={onRefreshHealth}
            className="flex items-center space-x-1.5 text-[#2563eb] font-bold cursor-pointer hover:underline text-xs"
          >
            <MapPin className="w-4 h-4 text-[#2563eb]" />
            <span>FIND MY TECH HUB</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

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
            <span>{isConnected ? 'Supabase Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
