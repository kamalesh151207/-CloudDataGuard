import React, { useEffect, useState } from 'react';
import { X, Calendar, MapPin, Building, Mail, Phone, ShieldCheck, History, Fingerprint } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { recordApi } from '../../services/api';

export default function RecordDrawer({ recordId, onClose }) {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!recordId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await recordApi.getRecordById(recordId);
        if (res.success) {
          setRecord(res.data);
        }
      } catch (err) {
        setError('Failed to load record details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [recordId]);

  if (!recordId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#0f172a] border-l border-slate-200 dark:border-slate-800 h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-cyan-950/80 border border-indigo-200 dark:border-cyan-800/60 text-indigo-600 dark:text-cyan-400 flex items-center justify-center font-bold text-base">
                {record?.name ? record.name.charAt(0).toUpperCase() : 'R'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{record?.name || 'Loading...'}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Record ID: {recordId}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 space-y-4">
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6 animate-pulse" />
            </div>
          ) : error ? (
            <div className="py-12 text-center text-rose-600 text-sm">
              {error}
            </div>
          ) : record && (
            <div className="py-6 space-y-6">
              {/* Status Section */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Validation Status</span>
                <StatusBadge status={record.status} />
              </div>

              {/* Core Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4" /> Attributes & Normalized Fields
                </h4>

                <div className="grid grid-cols-1 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </span>
                    <span className="font-mono text-slate-900 dark:text-slate-200 font-medium">{record.email}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> Phone
                    </span>
                    <span className="font-mono text-slate-900 dark:text-slate-200 font-medium">{record.phone}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Building className="w-3.5 h-3.5" /> Department
                    </span>
                    <span className="text-slate-900 dark:text-slate-200 font-medium">{record.department}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> Location
                    </span>
                    <span className="text-slate-900 dark:text-slate-200 font-medium">{record.location}</span>
                  </div>
                </div>
              </div>

              {/* Validation Result / Reason */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Deduplication Result
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {record.validationReason}
                </p>
              </div>

              {/* Timestamps */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Created At
                  </span>
                  <span className="font-mono text-slate-800 dark:text-slate-300 font-medium">
                    {new Date(record.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Updated At
                  </span>
                  <span className="font-mono text-slate-800 dark:text-slate-300 font-medium">
                    {new Date(record.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Validation Audit Trail */}
              {record.history && record.history.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <History className="w-4 h-4" /> Validation Audit History
                  </h4>
                  <div className="space-y-2 text-xs max-h-44 overflow-y-auto pr-1">
                    {record.history.map((log) => (
                      <div key={log._id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-start space-x-2">
                        <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                          log.status === 'verified' ? 'bg-emerald-500' : log.status === 'redundant' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                        <div>
                          <p className="text-slate-800 dark:text-slate-300 font-medium">{log.description}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
