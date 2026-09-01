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
      className={`hidden md:flex flex-col justify-between h-screen sticky top-0 bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-slate-800/80 transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-teal-500 flex items-center justify-center shadow-md flex-shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  CloudDataGuard
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-cyan-400 font-semibold tracking-wider uppercase">
                  Deduplication Engine
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
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
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-gradient-to-r dark:from-cyan-500/15 dark:to-emerald-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-200/80 dark:border-cyan-500/30 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-cyan-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Branding */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40">
        {!collapsed ? (
          <div className="flex flex-col space-y-1">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide">CloudDataGuard</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Cloud Data Quality Engine</span>
            <span className="text-[10px] text-teal-600 dark:text-emerald-400 font-mono mt-1">v1.0.0 • CodeAlpha Task 1</span>
          </div>
        ) : (
          <div className="flex justify-center" title="CloudDataGuard Cloud Data Quality Engine">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
