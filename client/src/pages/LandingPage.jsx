import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight, 
  Database, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Zap, 
  Activity, 
  CheckCircle2, 
  Layers, 
  ChevronRight,
  Server,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ onNavigate }) {
  const { login } = useAuth();
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    const res = await login(email || 'admin@clouddataguard.io', password || 'password123');
    setSubmitting(false);

    if (res.success) {
      onNavigate('overview');
    } else {
      setMsg(res.message);
    }
  };

  const handleAutofillDemo = () => {
    setEmail('admin@clouddataguard.io');
    setPassword('password123');
    setName('Cloud Security Admin');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <nav className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('overview')}>
          <img 
            src="/logo.png" 
            alt="CloudDataGuard Logo" 
            className="w-10 h-10 object-contain rounded-xl shadow-xs border border-slate-200" 
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-slate-900 font-sans">
              CloudDataGuard
            </span>
            <span className="text-[10px] text-[#2563eb] font-bold tracking-wider uppercase">
              Deduplication Engine
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-8 text-xs font-bold text-slate-600">
          <a href="#features" className="hover:text-[#2563eb] transition">FEATURES</a>
          <a href="#architecture" className="hover:text-[#2563eb] transition">DATABASE ARCHITECTURE</a>
          <a href="#how-it-works" className="hover:text-[#2563eb] transition">HOW IT WORKS</a>
          <a href="#auth-card" className="hover:text-[#2563eb] transition">AUTHENTICATION</a>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setAuthTab('login');
              const el = document.getElementById('auth-card');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#2563eb] hover:bg-slate-50 transition"
          >
            Log In
          </button>

          <button
            onClick={() => {
              setAuthTab('register');
              const el = document.getElementById('auth-card');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs shadow-sm transition"
          >
            Register / Join
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headlines & CTA */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563eb] text-xs font-bold">
            <Sparkles className="w-4 h-4 text-[#2563eb]" />
            <span>CodeAlpha Internship Task 1 • Supabase PostgreSQL 17.6</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 font-sans">
            Validate<span className="text-[#2563eb]">.</span> Deduplicate<span className="text-blue-500">.</span><br />
            Trust your data<span className="text-emerald-500">.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            A production-quality cloud data redundancy removal system. Validates incoming record streams against existing records, classifies payloads, and enforces 0-redundancy database accuracy.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('overview')}
              className="px-6 py-3.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition flex items-center space-x-2"
            >
              <span>LAUNCH DATA ENGINE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('validation')}
              className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-extrabold text-xs uppercase tracking-wider transition"
            >
              TRY VALIDATION DEMO
            </button>
          </div>
        </div>

        {/* Right Column: Embedded Login / Register Card */}
        <div id="auth-card" className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl shadow-xl p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {authTab === 'login' ? 'Log In To Account' : 'Create Enterprise Account'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Access your cloud deduplication engine dashboard.
              </p>
            </div>

            <button
              onClick={handleAutofillDemo}
              className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563eb] text-[10px] font-bold border border-blue-200 hover:bg-blue-100 transition"
            >
              Autofill Demo
            </button>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setAuthTab('login')}
              className={`flex-1 py-2 rounded-lg transition ${
                authTab === 'login' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setAuthTab('register')}
              className={`flex-1 py-2 rounded-lg transition ${
                authTab === 'register' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register / Join
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authTab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#2563eb]" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Cloud Security Admin"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#2563eb] transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#2563eb]" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@clouddataguard.io"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#2563eb] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#2563eb]" /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#2563eb] transition"
              />
            </div>

            {msg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs tracking-wider uppercase transition shadow-sm flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{authTab === 'login' ? 'Log In To Engine' : 'Register Enterprise Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-400">
            Protected by Supabase PostgreSQL Sparse Unique Indexing & JWT Security.
          </p>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-16 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">Engine Capabilities</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Complete Data Redundancy Removal System
            </h2>
            <p className="text-xs text-slate-600">
              Designed specifically for CodeAlpha Task 1 to meet all internship requirements with enterprise standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2563eb]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">3-Level Duplicate Detection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Checks incoming records against Level 1 (Exact match), Level 2 (Email collision), and Level 3 (Phone digit collision).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Supabase PostgreSQL Database</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connects directly to live Supabase PostgreSQL with sparse unique indexes to enforce 0-redundancy at the database level.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Real-Time Audit Telemetry</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Logs all validation checks, record insertions, and duplicate rejections to maintain a tamper-proof audit history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-[#2563eb]" />
            <span className="font-extrabold text-slate-900 text-sm">CloudDataGuard</span>
            <span>— CodeAlpha Cloud Computing Task 1</span>
          </div>

          <div className="flex items-center space-x-6 font-semibold">
            <span onClick={() => onNavigate('overview')} className="hover:text-[#2563eb] cursor-pointer">Dashboard</span>
            <span onClick={() => onNavigate('validation')} className="hover:text-[#2563eb] cursor-pointer">Validation</span>
            <span onClick={() => onNavigate('records')} className="hover:text-[#2563eb] cursor-pointer">Records</span>
            <span onClick={() => onNavigate('health')} className="hover:text-[#2563eb] cursor-pointer">System Health</span>
          </div>

          <span>© 2026 CloudDataGuard. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
