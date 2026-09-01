import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Database, 
  BarChart3, 
  Activity, 
  HeartPulse, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  ShieldAlert
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
      className={`hidden md:flex flex-col justify-between h-screen sticky top-0 bg-white border-r border-slate-200 transition-all duration-300 z-30 shadow-xs ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#2563eb] flex items-center justify-center shadow-sm flex-shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  CloudDataGuard
                </span>
                <span className="text-[10px] text-[#2563eb] font-bold tracking-wider uppercase">
                  Deduplication Engine
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group ${
                  isActive
                    ? 'bg-blue-50 text-[#2563eb] border border-blue-200 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-[#2563eb]' : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#2563eb]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Branding */}
      <div className="p-4 border-t border-slate-100 bg-[#f8fafc]">
        {!collapsed ? (
          <div className="flex flex-col space-y-1">
            <span className="text-xs font-bold text-slate-900 tracking-wide">CloudDataGuard</span>
            <span className="text-[11px] text-slate-500 font-medium">Enterprise Cloud Engine</span>
            <span className="text-[10px] text-[#2563eb] font-mono font-bold mt-1">v1.0.0 • CodeAlpha Task 1</span>
          </div>
        ) : (
          <div className="flex justify-center" title="CloudDataGuard Engine">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
