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
  ChevronRight
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
      className={`hidden md:flex flex-col justify-between h-screen sticky top-0 bg-white border-r border-slate-200 transition-all duration-300 z-30 shadow-sm ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0052cc] to-[#0077e6] flex items-center justify-center shadow-md flex-shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  CloudDataGuard
                </span>
                <span className="text-[10px] text-[#0052cc] font-semibold tracking-wider uppercase">
                  Deduplication Engine
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
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
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 text-[#0052cc] border border-blue-200 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-[#0052cc]' : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0052cc]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Branding */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/80">
        {!collapsed ? (
          <div className="flex flex-col space-y-1">
            <span className="text-xs font-bold text-slate-900 tracking-wide">CloudDataGuard</span>
            <span className="text-[11px] text-slate-500">Enterprise Cloud Data Engine</span>
            <span className="text-[10px] text-[#0052cc] font-mono font-bold mt-1">v1.0.0 • CodeAlpha Task 1</span>
          </div>
        ) : (
          <div className="flex justify-center" title="CloudDataGuard Cloud Data Quality Engine">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0052cc] animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
