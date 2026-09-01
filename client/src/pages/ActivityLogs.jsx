import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Filter, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { activityApi } from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await activityApi.getLogs({
        status: statusFilter,
        page: 1,
        limit: 30
      });
      if (res.success) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Real-Time Event Audit Feed</h3>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Events</option>
              <option value="verified">Verified Inserted</option>
              <option value="redundant">Duplicate Rejected</option>
              <option value="invalid">Invalid Rejected</option>
            </select>
          </div>

          <button
            onClick={fetchLogs}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logs Feed Container */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
        {loading ? (
          <div className="py-12 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <Clock className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Activity Logs Found</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Events will appear here as records are evaluated.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {logs.map((log) => {
              const isVerified = log.status === 'verified';
              const isRedundant = log.status === 'redundant';
              const isInvalid = log.status === 'invalid';

              return (
                <div
                  key={log._id}
                  className={`p-4 rounded-xl border transition flex items-start justify-between ${
                    isVerified
                      ? 'bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/40 hover:bg-emerald-100/50'
                      : isRedundant
                      ? 'bg-rose-50/60 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800/40 hover:bg-rose-100/50'
                      : 'bg-amber-50/60 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/40 hover:bg-amber-100/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {isVerified && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                      {isRedundant && <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
                      {isInvalid && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {log.eventType.replace(/_/g, ' ')}
                        </span>
                        <StatusBadge status={log.status} size="small" />
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed font-medium">
                        {log.description}
                      </p>
                      {log.metadata?.reason && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                          Reason: {log.metadata.reason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold block">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
