import React, { useEffect, useState } from 'react';
import { 
  Database, 
  ShieldCheck, 
  CopyX, 
  AlertOctagon, 
  BarChart2, 
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import MetricCard from '../components/ui/MetricCard';
import QualityGauge from '../components/ui/QualityGauge';
import HeroBuiltIn from '../components/layout/HeroBuiltIn';
import { recordApi } from '../services/api';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';

export default function Overview({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await recordApi.getStats();
      if (res.success) {
        setStats(res);
      }
    } catch (err) {
      console.error('Failed to connect to stats engine:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const pieData = [
    { name: 'Unique Records', value: stats?.stats?.uniqueRecords || 0, color: '#10b981' },
    { name: 'Redundant Attempts', value: stats?.stats?.redundantAttempts || 0, color: '#f43f5e' },
    { name: 'Invalid Attempts', value: stats?.stats?.invalidAttempts || 0, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* BuiltIn Inspired Hero Section */}
      <HeroBuiltIn onNavigate={onNavigate} stats={stats?.stats} />

      {/* Dynamic KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Stored Records"
          value={stats?.stats?.totalRecords ?? 0}
          icon={Database}
          color="cyan"
          percentage={100}
          trend="neutral"
          description="Active verified cloud database entries"
        />

        <MetricCard
          title="Unique Records"
          value={stats?.stats?.uniqueRecords ?? 0}
          icon={ShieldCheck}
          color="emerald"
          percentage={stats?.stats?.validationSuccessRate ?? 100}
          trend="up"
          description="Passed schema & deduplication checks"
        />

        <MetricCard
          title="Redundant Attempts"
          value={stats?.stats?.redundantAttempts ?? 0}
          icon={CopyX}
          color="rose"
          percentage={stats?.stats?.redundancyPercentage ?? 0}
          trend="down"
          description="Blocked duplicate data collisions"
        />

        <MetricCard
          title="Invalid Attempts"
          value={stats?.stats?.invalidAttempts ?? 0}
          icon={AlertOctagon}
          color="amber"
          percentage={stats?.stats?.invalidAttempts > 0 ? 
            parseFloat(((stats.stats.invalidAttempts / (stats.stats.totalAttempts || 1)) * 100).toFixed(1)) : 0}
          trend="neutral"
          description="Failed schema formatting checks"
        />
      </div>

      {/* Middle Section: Quality Score Gauge + Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Quality Score */}
        <div className="lg:col-span-1">
          <QualityGauge 
            score={stats?.stats?.dataQualityScore ?? 100} 
            label="Overall Cloud Data Quality"
          />
        </div>

        {/* Classification Distribution Chart */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-600 dark:text-cyan-400" /> Record Classification Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Distribution of evaluated data points</p>
            </div>
            <button 
              onClick={fetchStats}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Refresh stats"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {pieData.length > 0 ? (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
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
              <div className="flex justify-center space-x-6 text-xs mt-2">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Verified ({stats?.stats?.uniqueRecords || 0})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Redundant ({stats?.stats?.redundantAttempts || 0})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Invalid ({stats?.stats?.invalidAttempts || 0})</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Database className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No Validation Data Collected Yet</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Validate incoming records to populate real-time charts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
