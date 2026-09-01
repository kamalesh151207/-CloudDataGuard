import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Database, 
  FileText, 
  Zap, 
  ChevronDown,
  Droplets
} from 'lucide-react';

export default function HeroBuiltIn({ onNavigate, stats }) {
  return (
    <div className="w-full bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#047857] text-white py-12 px-6 sm:px-12 relative overflow-hidden shadow-xl rounded-3xl mb-8 border border-emerald-400/30">
      {/* Background Radial Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-green-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* AquaSmart Hero Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#f0fdf4]/10 border border-[#bbf7d0]/30 text-[#86efac] text-xs font-semibold backdrop-blur-md">
          <Droplets className="w-4 h-4 text-[#86efac]" />
          <span>AquaSmart AI Engine • Precision Cloud Data Management</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white font-sans">
            Automate irrigation logic<span className="text-[#86efac]">.</span><br />
            Ensure 100<span className="text-[#4ade80]">%</span> clean cloud data<span className="text-[#86efac]">.</span>
          </h1>

          <p className="text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            AI-powered smart water & data quality management for modern cloud infrastructures. Validate streams, eliminate redundancies, and guarantee zero-duplicate storage.
          </p>

          {/* AquaSmart Floating Stats Bar */}
          <div className="pt-2">
            <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-2 shadow-lg max-w-2xl text-slate-800 grid grid-cols-3 divide-x divide-slate-200 text-center">
              <div className="px-4 py-2">
                <span className="text-xl font-extrabold text-[#15803d] font-mono block">{stats?.totalRecords ?? '12.4K'}</span>
                <span className="text-[11px] text-slate-500 font-medium">Stored Records</span>
              </div>
              <div className="px-4 py-2">
                <span className="text-xl font-extrabold text-[#16a34a] font-mono block">{stats?.dataQualityScore ?? '99.8'}%</span>
                <span className="text-[11px] text-slate-500 font-medium">Data Quality Score</span>
              </div>
              <div className="px-4 py-2">
                <span className="text-xl font-extrabold text-[#047857] font-mono block">{stats?.redundantAttempts ?? '0'}</span>
                <span className="text-[11px] text-slate-500 font-medium">Redundant Blocked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Card */}
        <div className="bg-white text-slate-900 rounded-2xl shadow-xl p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-4 border border-slate-200">
          <div className="text-base font-extrabold text-slate-900 tracking-tight whitespace-nowrap lg:border-r border-slate-200 pr-4">
            Validate cloud payload<span className="text-[#16a34a]">.</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
            <div className="relative w-full">
              <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 appearance-none focus:outline-none focus:border-[#16a34a] cursor-pointer">
                <option value="Engineering">Engineering Department</option>
                <option value="Cloud Security">Cloud Security</option>
                <option value="Data Ops">Data Ops</option>
                <option value="DevOps">DevOps</option>
                <option value="AI & Analytics">AI & Analytics</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>

            <div className="relative w-full">
              <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 appearance-none focus:outline-none focus:border-[#16a34a] cursor-pointer">
                <option value="strict">Full 3-Level Deduplication</option>
                <option value="email">Strict Email Matching</option>
                <option value="phone">Strict Phone Matching</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={() => onNavigate('validation')}
            className="w-full lg:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#16a34a] to-[#059669] hover:from-[#15803d] hover:to-[#047857] text-white font-extrabold text-xs tracking-wider uppercase transition shadow-[0_6px_20px_rgba(22,163,74,0.3)] hover:scale-105 whitespace-nowrap flex items-center justify-center space-x-2"
          >
            <span>LAUNCH AI ENGINE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Links Below Hero */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs font-bold pt-2 border-t border-emerald-400/20">
          <button 
            onClick={() => onNavigate('records')}
            className="flex items-center space-x-2 text-white hover:text-emerald-200 underline decoration-[#86efac] underline-offset-4 transition"
          >
            <Database className="w-4 h-4 text-[#86efac]" />
            <span>Match With Existing Records</span>
          </button>

          <button 
            onClick={() => onNavigate('analytics')}
            className="flex items-center space-x-2 text-white hover:text-emerald-200 underline decoration-[#86efac] underline-offset-4 transition"
          >
            <FileText className="w-4 h-4 text-[#4ade80]" />
            <span>Read AI Quality Reports</span>
          </button>

          <button 
            onClick={() => onNavigate('logs')}
            className="flex items-center space-x-2 text-white hover:text-emerald-200 underline decoration-[#86efac] underline-offset-4 transition"
          >
            <Zap className="w-4 h-4 text-[#86efac]" />
            <span>Receive Telemetry Alerts</span>
          </button>
        </div>
      </div>
    </div>
  );
}
