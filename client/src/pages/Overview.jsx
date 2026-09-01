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
      {/* Top Banner / Call to Action */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800/80 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span>CodeAlpha Cloud Security Suite</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">
            Data Quality & Redundancy Prevention Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time validation engine preventing duplicate and false-positive records from entering cloud MongoDB Atlas.
          </p>
        </div>

        <button
          onClick={() => onNavigate('validation')}
          className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-glow-cyan transition"
        >
          <span>Validate New Record</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dynamic KPI Section (Requirement 7) */}
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
        {/* Data Quality Score (Requirement 8) */}
        <div className="lg:col-span-1">
          <QualityGauge 
            score={stats?.stats?.dataQualityScore ?? 100} 
            label="Overall Cloud Data Quality"
          />
        </div>

        {/* Classification Distribution Chart (Requirement 9) */}
        <div className="lg:col-span-2 p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" /> Record Classification Breakdown
              </h3>
              <p className="text-xs text-slate-400">Distribution of evaluated data points</p>
            </div>
            <button 
              onClick={fetchStats}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
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
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-6 text-xs mt-2">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-300">Verified ({stats?.stats?.uniqueRecords || 0})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-300">Redundant ({stats?.stats?.redundantAttempts || 0})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-300">Invalid ({stats?.stats?.invalidAttempts || 0})</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl">
              <Database className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-300">No Validation Data Collected Yet</p>
              <p className="text-[11px] text-slate-400 mt-1">Validate incoming records to populate real-time charts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
