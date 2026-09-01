import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Database, 
  BarChart3, 
  Activity, 
  HeartPulse, 
  Settings, 
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'validation', label: 'Data Validation', icon: ShieldCheck },
  { id: 'records', label: 'Records', icon: Database },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'logs', label: 'Activity Logs', icon: Activity },
  { id: 'health', label: 'System Health', icon: HeartPulse },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  return (
    <aside
      className={`hidden md:flex flex-col justify-between h-screen sticky top-0 bg-[#080214] border-r border-pink-500/30 transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-pink-500/30">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff007f] via-[#b5179e] to-[#00f0ff] flex items-center justify-center shadow-[0_0_15px_rgba(255,0,128,0.5)] flex-shrink-0 border border-pink-400/50">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-base tracking-wider text-white">
                  Cloud<span className="text-[#00f0ff]">Data</span><span className="text-[#ff007f]">Guard</span>
                </span>
                <span className="text-[10px] text-[#00f0ff] font-bold tracking-widest uppercase flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#ff007f]" /> Redundancy Engine
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-pink-300 hover:text-white hover:bg-pink-950/40 transition border border-pink-500/20"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff007f]/20 to-[#00f0ff]/10 text-[#00f0ff] border border-pink-500/50 shadow-[0_0_15px_rgba(255,0,128,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-pink-950/30 border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-[#ff007f] drop-shadow-[0_0_8px_rgba(255,0,128,0.8)]' : 'text-slate-400 group-hover:text-pink-300'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Branding */}
      <div className="p-4 border-t border-pink-500/30 bg-[#0c031f]">
        {!collapsed ? (
          <div className="flex flex-col space-y-1">
            <span className="text-xs font-bold text-white tracking-wider">CloudDataGuard</span>
            <span className="text-[11px] text-pink-300/80">Cyberpunk Redundancy Engine</span>
            <span className="text-[10px] text-[#00f0ff] font-mono font-bold mt-1">v1.0.0 • CodeAlpha Task 1</span>
          </div>
        ) : (
          <div className="flex justify-center" title="CloudDataGuard Cloud Data Quality Engine">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff007f] animate-pulse shadow-[0_0_8px_#ff007f]" />
          </div>
        )}
      </div>
    </aside>
  );
}
