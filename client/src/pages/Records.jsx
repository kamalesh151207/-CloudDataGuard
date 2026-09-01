import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Database, 
  Eye, 
  RefreshCw
} from 'lucide-react';
import { recordApi } from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';
import RecordDrawer from '../components/ui/RecordDrawer';

export default function Records({ initialSearch = '' }) {
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearch(initialSearch);
    }
  }, [initialSearch]);

  const fetchRecords = async (page = 1) => {
    try {
      setLoading(true);
      const res = await recordApi.getRecords({
        page,
        limit: 8,
        search,
        status: statusFilter,
        department: deptFilter,
        sortBy: 'createdAt',
        order: 'desc'
      });

      if (res.success) {
        setRecords(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(1);
  }, [search, statusFilter, deptFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search & Filter Header Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified Only</option>
              <option value="redundant">Redundant</option>
              <option value="invalid">Invalid</option>
            </select>
          </div>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Cloud Security">Cloud Security</option>
            <option value="Data Ops">Data Ops</option>
            <option value="DevOps">DevOps</option>
            <option value="AI & Analytics">AI & Analytics</option>
          </select>

          <button
            onClick={() => fetchRecords(pagination.currentPage)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600 dark:text-cyan-400" /> Stored Database Records
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {records.length} of {pagination.totalRecords} records
            </p>
          </div>
        </div>

        {/* Table / Loading State */}
        {loading ? (
          <div className="py-12 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <Database className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Records Found</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Record ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created At</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {records.map((rec) => (
                  <tr 
                    key={rec._id} 
                    onClick={() => setSelectedRecordId(rec._id)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition cursor-pointer group"
                  >
                    <td className="px-4 py-3.5 font-mono text-[11px] text-indigo-600 dark:text-cyan-400 font-bold">
                      {rec._id.substring(rec._id.length - 6)}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100">
                      {rec.name}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                      {rec.email}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                      {rec.phone}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">
                      {rec.department}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">
                      {rec.location}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={rec.status} size="small" />
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecordId(rec._id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Backend Pagination Controls */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <div className="flex items-center space-x-2">
            <button
              disabled={!pagination.hasPrevPage || loading}
              onClick={() => fetchRecords(pagination.currentPage - 1)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition flex items-center gap-1 font-semibold"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              disabled={!pagination.hasNextPage || loading}
              onClick={() => fetchRecords(pagination.currentPage + 1)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition flex items-center gap-1 font-semibold"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Record Detail Drawer */}
      <RecordDrawer
        recordId={selectedRecordId}
        onClose={() => setSelectedRecordId(null)}
      />
    </div>
  );
}
