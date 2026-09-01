import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Check, 
  Sparkles, 
  KeyRound, 
  Database,
  Building,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onLoginSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setErrorMsg(res.message);
    }
  };

  const autofillDemo = () => {
    setEmail('admin@clouddataguard.io');
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Visual Branding Panel */}
        <div className="bg-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="CloudDataGuard Logo" 
                className="w-11 h-11 object-contain rounded-xl shadow-sm border border-slate-700 bg-white/10 p-1" 
              />
              <div>
                <h2 className="font-extrabold text-xl tracking-tight text-white font-sans">
                  CloudDataGuard
                </h2>
                <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                  Cloud Security & Compliance
                </span>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <h3 className="text-2xl font-serif font-bold text-white leading-tight">
                Enterprise Cloud Data Quality Engine<span className="text-[#2563eb]">.</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Log in to monitor data deduplication metrics, validate raw data streams, and configure MongoDB Atlas unique index rules.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-8 relative z-10">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-1.5">
              <p className="font-bold text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> CodeAlpha Internship Task 1
              </p>
              <p className="text-[11px] text-slate-300">
                Guaranteed 0-redundancy cloud database insertion with 3-level duplicate detection.
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>v1.0.0 • Verified System</span>
              <span className="text-emerald-400 font-bold">🟢 Atlas Online</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Log In To Enterprise
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your cloud credentials to access your data quality hub.
                </p>
              </div>

              <button
                onClick={autofillDemo}
                className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563eb] text-[10px] font-bold border border-blue-200 hover:bg-blue-100 transition"
                title="Fill demo admin credentials"
              >
                Autofill Demo
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition"
                />
              </div>

              {/* Password */}
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition"
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#2563eb] rounded"
                  />
                  <span>Remember session</span>
                </label>
                <span className="text-[#2563eb] hover:underline cursor-pointer font-semibold">
                  Forgot password?
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Royal Blue Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs tracking-wider uppercase transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
              >
                {submitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Log In to Cloud Data Guard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
            <span>Don't have an enterprise account? </span>
            <span onClick={autofillDemo} className="text-[#2563eb] font-bold hover:underline cursor-pointer">
              Use Guest Access
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
