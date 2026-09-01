import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Zap, 
  Database,
  ChevronDown
} from 'lucide-react';

export default function HeroBuiltIn({ onNavigate, stats }) {
  return (
    <div className="w-full bg-gradient-to-r from-[#03143c] via-[#073680] to-[#008cc9] text-white py-12 px-6 sm:px-12 relative overflow-hidden shadow-xl rounded-2xl mb-8">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Category Tagline */}
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-cyan-300">
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>TECH TRENDS, CLOUD DATA QUALITY + REDUNDANCY ENGINE</span>
        </div>

        {/* Hero Title (Inspired by BuiltIn: Learn. Grow. Build your career.) */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight leading-tight text-white">
            Validate<span className="text-emerald-400 font-sans">.</span> Deduplicate<span className="text-cyan-300 font-sans">.</span><br />
            Trust your data<span className="text-teal-300 font-sans">.</span>
          </h1>

          {/* Key Metrics Banner */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold tracking-wider uppercase text-cyan-100/90 pt-1">
            <span className="text-white font-mono">{stats?.totalRecords ?? '12.4K'} STORED RECORDS</span>
            <span>•</span>
            <span className="text-emerald-300 font-mono">{stats?.dataQualityScore ?? '99.8'}% QUALITY SCORE</span>
            <span>•</span>
            <span className="text-cyan-200 font-mono">{stats?.redundantAttempts ?? '0'} REDUNDANT BLOCKED</span>
          </div>
        </div>

        {/* Floating Validation Action Card (Exact BuiltIn Search Card Layout) */}
        <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-4 border border-slate-100">
          <div className="text-base font-extrabold text-slate-900 tracking-tight whitespace-nowrap lg:border-r border-slate-200 pr-4">
            Validate cloud record<span className="text-[#0088cc]">.</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
            {/* Input / Dropdown 1 */}
            <div className="relative w-full">
              <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 appearance-none focus:outline-none focus:border-[#0088cc] cursor-pointer">
                <option value="Engineering">Engineering Department</option>
                <option value="Cloud Security">Cloud Security</option>
                <option value="Data Ops">Data Ops</option>
                <option value="DevOps">DevOps</option>
                <option value="AI & Analytics">AI & Analytics</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>

            {/* Dropdown 2 */}
            <div className="relative w-full">
              <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 appearance-none focus:outline-none focus:border-[#0088cc] cursor-pointer">
                <option value="strict">Full 3-Level Deduplication</option>
                <option value="email">Strict Email Matching</option>
                <option value="phone">Strict Phone Matching</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => onNavigate('validation')}
            className="w-full lg:w-auto px-6 py-3.5 rounded-xl bg-[#00a8e8] hover:bg-[#0092cc] text-white font-extrabold text-xs tracking-wider uppercase transition shadow-md whitespace-nowrap flex items-center justify-center space-x-2"
          >
            <span>GO TO VALIDATION ENGINE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Pill Links Below Hero */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs font-bold pt-2 border-t border-cyan-400/20">
          <button 
            onClick={() => onNavigate('records')}
            className="flex items-center space-x-2 text-white hover:text-cyan-200 underline decoration-cyan-300 underline-offset-4 transition"
          >
            <Database className="w-4 h-4 text-cyan-300" />
            <span>Match With Existing Records</span>
          </button>

          <button 
            onClick={() => onNavigate('analytics')}
            className="flex items-center space-x-2 text-white hover:text-cyan-200 underline decoration-cyan-300 underline-offset-4 transition"
          >
            <FileText className="w-4 h-4 text-emerald-300" />
            <span>Read Data Quality Reports</span>
          </button>

          <button 
            onClick={() => onNavigate('logs')}
            className="flex items-center space-x-2 text-white hover:text-cyan-200 underline decoration-cyan-300 underline-offset-4 transition"
          >
            <Zap className="w-4 h-4 text-teal-300" />
            <span>Receive Real-Time Collision Alerts</span>
          </button>
        </div>
      </div>
    </div>
  );
}
