import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  ShieldAlert, 
  RefreshCw,
  Activity,
  Layers
} from 'lucide-react';
import { recordApi } from '../services/api';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await recordApi.getStats();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const stats = data?.stats;

  const pieData = [
    { name: 'Unique Records', value: stats?.uniqueRecords || 0, color: '#10b981' },
    { name: 'Redundant Attempts', value: stats?.redundantAttempts || 0, color: '#f43f5e' },
    { name: 'Invalid Attempts', value: stats?.invalidAttempts || 0, color: '#f59e0b' },
  ].filter(i => i.value > 0);

  const departmentData = data?.departmentBreakdown || [];
  const duplicateReasons = data?.duplicateReasons || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Stat Summary Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Quality Score</span>
          <h3 className="text-2xl font-extrabold text-indigo-600 dark:text-cyan-400 mt-1 font-mono">{stats?.dataQualityScore ?? 100}%</h3>
          <span className="text-[10px] text-slate-400">Based on DB statistics</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Success Rate</span>
          <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{stats?.validationSuccessRate ?? 100}%</h3>
          <span className="text-[10px] text-slate-400">Accepted records</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Redundancy %</span>
          <h3 className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 font-mono">{stats?.redundancyPercentage ?? 0}%</h3>
          <span className="text-[10px] text-slate-400">Duplicate collisions</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Evaluated</span>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">{stats?.totalAttempts ?? 0}</h3>
          <span className="text-[10px] text-slate-400">Evaluated data points</span>
        </div>
      </div>

      {/* Grid of Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Classification Distribution */}
        <div className="p-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-600 dark:text-cyan-400" /> Record Classification Breakdown
            </h3>
          </div>

          <div className="h-64 w-full">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No data available for visualization.
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Verified Records by Department */}
        <div className="p-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Unique Records by Department
            </h3>
          </div>

          <div className="h-64 w-full">
            {departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No department data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Top Duplicate Causes */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" /> Top Rejection Causes & Field Collisions
            </h3>
          </div>

          {duplicateReasons.length > 0 ? (
            <div className="space-y-3">
              {duplicateReasons.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-800 dark:text-slate-300 font-semibold">{item.reason}</span>
                  <span className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 text-xs font-mono font-bold border border-rose-200 dark:border-rose-800/60">
                    {item.count} occurrences
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Zero duplicate collisions recorded. Engine data quality clean!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
