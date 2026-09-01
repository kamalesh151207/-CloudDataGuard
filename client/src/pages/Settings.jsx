import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Sliders, 
  Moon, 
  Sun, 
  Check, 
  ShieldCheck, 
  Database, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [autoNormalize, setAutoNormalize] = useState(true);
  const [level1Exact, setLevel1Exact] = useState(true);
  const [level2Email, setLevel2Email] = useState(true);
  const [level3Phone, setLevel3Phone] = useState(true);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveSettings = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-cyan-400" /> Engine & Workspace Configuration
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize deduplication engine rules, normalization parameters, and visual theme preferences.
        </p>
      </div>

      {/* Visual Theme Section */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" /> Interface Theme Selector
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Cyber Amethyst Theme */}
          <div
            onClick={() => setTheme('cyber')}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-3 ${
              theme === 'cyber'
                ? 'border-purple-500 bg-purple-950/20 shadow-glow-cyan'
                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Cyber Amethyst
              </span>
              {theme === 'cyber' && <Check className="w-4 h-4 text-purple-400" />}
            </div>
            <div className="h-10 rounded-xl bg-gradient-to-r from-[#060913] via-[#0b0f24] to-[#161233] p-2 flex items-center gap-1.5 border border-purple-500/30">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="w-3 h-3 rounded-full bg-cyan-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400">Futuristic electric violet & neon cyan obsidian design.</p>
          </div>

          {/* Deep Navy Slate Theme */}
          <div
            onClick={() => setTheme('navy')}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-3 ${
              theme === 'navy'
                ? 'border-cyan-500 bg-cyan-950/20 shadow-glow-emerald'
                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-cyan-400" /> Deep Obsidian
              </span>
              {theme === 'navy' && <Check className="w-4 h-4 text-cyan-400" />}
            </div>
            <div className="h-10 rounded-xl bg-gradient-to-r from-[#090d16] via-[#0b1120] to-[#0f172a] p-2 flex items-center gap-1.5 border border-cyan-500/30">
              <span className="w-3 h-3 rounded-full bg-sky-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="w-3 h-3 rounded-full bg-rose-500" />
            </div>
            <p className="text-[11px] text-slate-400">Classic enterprise deep navy dark mode.</p>
          </div>

          {/* Nordic Light Theme */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-3 ${
              theme === 'light'
                ? 'border-indigo-500 bg-indigo-50/10 shadow-sm'
                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Nordic Light
              </span>
              {theme === 'light' && <Check className="w-4 h-4 text-indigo-400" />}
            </div>
            <div className="h-10 rounded-xl bg-gradient-to-r from-slate-100 via-white to-slate-200 p-2 flex items-center gap-1.5 border border-slate-300">
              <span className="w-3 h-3 rounded-full bg-indigo-600" />
              <span className="w-3 h-3 rounded-full bg-teal-600" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
            </div>
            <p className="text-[11px] text-slate-400">Clean, crisp high-contrast light SaaS theme.</p>
          </div>
        </div>
      </div>

      {/* Deduplication Parameters */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Deduplication Engine Rules
        </h3>

        <div className="space-y-3 text-xs">
          {/* Rule 1 */}
          <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-200">Automatic Data Normalization</p>
              <p className="text-[11px] text-slate-400">Trim spaces, lowercase emails, extract digit-only phone numbers prior to comparison</p>
            </div>
            <input
              type="checkbox"
              checked={autoNormalize}
              onChange={(e) => setAutoNormalize(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          {/* Rule 2 */}
          <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-200">Level 1: Exact Duplicate Match</p>
              <p className="text-[11px] text-slate-400">Compare normalized name, email, and phone</p>
            </div>
            <input
              type="checkbox"
              checked={level1Exact}
              onChange={(e) => setLevel1Exact(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          {/* Rule 3 */}
          <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-200">Level 2: Strong Email Collision Check</p>
              <p className="text-[11px] text-slate-400">Flag duplicate if normalized email already exists</p>
            </div>
            <input
              type="checkbox"
              checked={level2Email}
              onChange={(e) => setLevel2Email(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          {/* Rule 4 */}
          <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-200">Level 3: Strong Phone Collision Check</p>
              <p className="text-[11px] text-slate-400">Flag duplicate if normalized phone number already exists</p>
            </div>
            <input
              type="checkbox"
              checked={level3Phone}
              onChange={(e) => setLevel3Phone(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {savedMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold text-center">
            Settings updated successfully!
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={handleSaveSettings}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-glow-cyan transition flex items-center justify-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
}
