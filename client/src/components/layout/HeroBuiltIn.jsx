import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Database, 
  FileText, 
  Zap, 
  ChevronDown 
} from 'lucide-react';

export default function HeroBuiltIn({ onNavigate, stats }) {
  return (
    <div className="w-full bg-white text-slate-900 py-10 px-6 sm:px-10 relative overflow-hidden shadow-xs rounded-3xl mb-8 border border-slate-200">
      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* Badge Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563eb] text-xs font-bold">
          <Sparkles className="w-4 h-4 text-[#2563eb]" />
          <span>CloudDataGuard • Data Redundancy Removal System</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 font-sans">
            Validate<span className="text-[#2563eb]">.</span> Deduplicate<span className="text-blue-500">.</span><br />
            Trust your data<span className="text-emerald-500">.</span>
          </h1>

          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Real-time validation engine preventing redundant and false-positive records from being inserted into your cloud database.
          </p>

          {/* Clean White Stats Bar */}
          <div className="pt-2">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 max-w-2xl text-slate-800 grid grid-cols-3 divide-x divide-slate-200 text-center">
              <div className="px-4 py-2">
                <span className="text-xl font-extrabold text-[#2563eb] font-mono block">{stats?.totalRecords ?? '12.4K'}</span>
                <span className="text-[11px] text-slate-500 font-medium">Stored Records</span>
              </div>
              <div className="px-4 py-2">
                <span className="text-xl font-extrabold text-emerald-600 font-mono block">{stats?.dataQualityScore ?? '99.8'}%</span>
                <span className="text-[11px] text-slate-500 font-medium">Data Quality Score</span>
              </div>
              <div className="px-4 py-2">
                <span className="text-xl font-extrabold text-indigo-600 font-mono block">{stats?.redundantAttempts ?? '0'}</span>
                <span className="text-[11px] text-slate-500 font-medium">Redundant Blocked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-slate-50 text-slate-900 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-4 border border-slate-200">
          <div className="text-base font-extrabold text-slate-900 tracking-tight whitespace-nowrap lg:border-r border-slate-200 pr-4">
            Validate cloud payload<span className="text-[#2563eb]">.</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
            <div className="relative w-full">
              <select className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 appearance-none focus:outline-none focus:border-[#2563eb] cursor-pointer">
                <option value="Engineering">Engineering Department</option>
                <option value="Cloud Security">Cloud Security</option>
                <option value="Data Ops">Data Ops</option>
                <option value="DevOps">DevOps</option>
                <option value="AI & Analytics">AI & Analytics</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>

            <div className="relative w-full">
              <select className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 appearance-none focus:outline-none focus:border-[#2563eb] cursor-pointer">
                <option value="strict">Full 3-Level Deduplication</option>
                <option value="email">Strict Email Matching</option>
                <option value="phone">Strict Phone Matching</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Royal Blue Button */}
          <button
            onClick={() => onNavigate('validation')}
            className="w-full lg:w-auto px-6 py-3.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs tracking-wider uppercase transition shadow-sm whitespace-nowrap flex items-center justify-center space-x-2"
          >
            <span>VALIDATE DATA RECORD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Links Below Hero */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs font-bold pt-2 border-t border-slate-200">
          <button 
            onClick={() => onNavigate('records')}
            className="flex items-center space-x-2 text-slate-700 hover:text-[#2563eb] underline decoration-blue-300 underline-offset-4 transition"
          >
            <Database className="w-4 h-4 text-[#2563eb]" />
            <span>Match With Existing Records</span>
          </button>

          <button 
            onClick={() => onNavigate('analytics')}
            className="flex items-center space-x-2 text-slate-700 hover:text-[#2563eb] underline decoration-emerald-300 underline-offset-4 transition"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Read Data Quality Reports</span>
          </button>

          <button 
            onClick={() => onNavigate('logs')}
            className="flex items-center space-x-2 text-slate-700 hover:text-[#2563eb] underline decoration-indigo-300 underline-offset-4 transition"
          >
            <Zap className="w-4 h-4 text-indigo-600" />
            <span>Receive Telemetry Alerts</span>
          </button>
        </div>
      </div>
    </div>
  );
}
