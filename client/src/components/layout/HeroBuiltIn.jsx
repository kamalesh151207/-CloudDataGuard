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
    <div className="w-full bg-gradient-to-r from-[#0e0026] via-[#28004d] to-[#002b4d] text-white py-12 px-6 sm:px-12 relative overflow-hidden shadow-[0_0_50px_rgba(255,0,128,0.3)] rounded-3xl mb-8 border border-pink-500/30">
      {/* Background Neon Grid Glow Graphics */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff007f]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#00f0ff]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Category Tagline */}
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#00f0ff]">
          <Zap className="w-4 h-4 text-[#ff007f]" />
          <span>CYBERPUNK DATA ENGINE, DEDUPLICATION + REDUNDANCY CONTROL</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white font-sans">
            Validate<span className="text-[#ff007f]">.</span> Deduplicate<span className="text-[#00f0ff]">.</span><br />
            Trust your data<span className="text-emerald-400">.</span>
          </h1>

          {/* Key Metrics Banner */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-extrabold tracking-wider uppercase text-pink-200/90 pt-1 font-mono">
            <span className="text-white">{stats?.totalRecords ?? '12.4K'} STORED RECORDS</span>
            <span className="text-[#ff007f]">•</span>
            <span className="text-[#00f0ff]">{stats?.dataQualityScore ?? '99.8'}% QUALITY SCORE</span>
            <span className="text-[#ff007f]">•</span>
            <span className="text-emerald-400">{stats?.redundantAttempts ?? '0'} REDUNDANT BLOCKED</span>
          </div>
        </div>

        {/* Floating Validation Action Card */}
        <div className="bg-[#0b041a]/90 backdrop-blur-2xl text-white rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.2)] p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-4 border border-pink-500/40">
          <div className="text-base font-extrabold tracking-tight whitespace-nowrap lg:border-r border-pink-500/30 pr-4 text-white">
            Validate cloud payload<span className="text-[#00f0ff]">.</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
            {/* Input / Dropdown 1 */}
            <div className="relative w-full">
              <select className="w-full px-4 py-3 rounded-xl bg-[#140630] border border-pink-500/40 text-xs font-bold text-slate-100 appearance-none focus:outline-none focus:border-[#00f0ff] cursor-pointer">
                <option value="Engineering">Engineering Department</option>
                <option value="Cloud Security">Cloud Security</option>
                <option value="Data Ops">Data Ops</option>
                <option value="DevOps">DevOps</option>
                <option value="AI & Analytics">AI & Analytics</option>
              </select>
              <ChevronDown className="w-4 h-4 text-pink-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>

            {/* Dropdown 2 */}
            <div className="relative w-full">
              <select className="w-full px-4 py-3 rounded-xl bg-[#140630] border border-pink-500/40 text-xs font-bold text-slate-100 appearance-none focus:outline-none focus:border-[#00f0ff] cursor-pointer">
                <option value="strict">Full 3-Level Deduplication</option>
                <option value="email">Strict Email Matching</option>
                <option value="phone">Strict Phone Matching</option>
              </select>
              <ChevronDown className="w-4 h-4 text-pink-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => onNavigate('validation')}
            className="w-full lg:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#00f0ff] text-slate-950 font-black text-xs tracking-wider uppercase transition shadow-[0_0_25px_rgba(255,0,128,0.6)] hover:scale-105 whitespace-nowrap flex items-center justify-center space-x-2"
          >
            <span>START VALIDATION ENGINE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Pill Links Below Hero */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs font-bold pt-2 border-t border-pink-500/30">
          <button 
            onClick={() => onNavigate('records')}
            className="flex items-center space-x-2 text-slate-200 hover:text-[#00f0ff] underline decoration-[#ff007f] underline-offset-4 transition"
          >
            <Database className="w-4 h-4 text-[#00f0ff]" />
            <span>Match With Existing Records</span>
          </button>

          <button 
            onClick={() => onNavigate('analytics')}
            className="flex items-center space-x-2 text-slate-200 hover:text-[#00f0ff] underline decoration-[#00f0ff] underline-offset-4 transition"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Read Data Quality Reports</span>
          </button>

          <button 
            onClick={() => onNavigate('logs')}
            className="flex items-center space-x-2 text-slate-200 hover:text-[#00f0ff] underline decoration-pink-500 underline-offset-4 transition"
          >
            <Zap className="w-4 h-4 text-[#ff007f]" />
            <span>Receive Real-Time Collision Alerts</span>
          </button>
        </div>
      </div>
    </div>
  );
}
