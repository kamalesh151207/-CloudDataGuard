import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Droplets,
  Zap
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
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-[#2563eb]" /> Engine & Workspace Configuration
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize deduplication engine rules, normalization parameters, and visual theme preferences.
        </p>
      </div>

      {/* Visual Theme Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2563eb]" /> Interface Theme Selector
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Pristine White & Royal Blue (Default) */}
          <div
            onClick={() => setTheme('whiteblue')}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-3 ${
              theme === 'whiteblue'
                ? 'border-[#2563eb] bg-blue-50/80 shadow-sm ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#2563eb]" /> White & Blue
              </span>
              {theme === 'whiteblue' && <Check className="w-4 h-4 text-[#2563eb]" />}
            </div>
            <div className="h-10 rounded-xl bg-slate-50 p-2 flex items-center gap-1.5 border border-slate-200">
              <span className="w-3.5 h-3.5 rounded-full bg-[#2563eb]" />
              <span className="w-3.5 h-3.5 rounded-full bg-white border border-slate-300" />
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-slate-600">Clean white theme with royal blue interactive buttons.</p>
          </div>

          {/* AquaSmart AI Emerald */}
          <div
            onClick={() => setTheme('aquasmart')}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-3 ${
              theme === 'aquasmart'
                ? 'border-[#16a34a] bg-[#f0fdf4] shadow-sm ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-[#16a34a]" /> AquaSmart AI
              </span>
              {theme === 'aquasmart' && <Check className="w-4 h-4 text-[#16a34a]" />}
            </div>
            <div className="h-10 rounded-xl bg-[#052e16] p-2 flex items-center gap-1.5 border border-emerald-500/30">
              <span className="w-3.5 h-3.5 rounded-full bg-[#16a34a]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#059669]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#86efac]" />
            </div>
            <p className="text-[11px] text-slate-600">Emerald green precision AI water & data management layout.</p>
          </div>

          {/* Cyberpunk Neon Synthwave */}
          <div
            onClick={() => setTheme('cyberpunk')}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-3 ${
              theme === 'cyberpunk'
                ? 'border-[#ff007f] bg-[#0c031f] shadow-[0_0_15px_rgba(255,0,128,0.3)]'
                : 'border-slate-200 dark:border-slate-800 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#ff007f]" /> Cyberpunk
              </span>
              {theme === 'cyberpunk' && <Check className="w-4 h-4 text-[#ff007f]" />}
            </div>
            <div className="h-10 rounded-xl bg-[#030008] p-2 flex items-center gap-1.5 border border-pink-500/40">
              <span className="w-3.5 h-3.5 rounded-full bg-[#ff007f]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#00f0ff]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#b5179e]" />
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Futuristic neon magenta & electric cyan dark mode.</p>
          </div>

          {/* BuiltIn Tech Hub */}
          <div
            onClick={() => setTheme('builtin')}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-3 ${
              theme === 'builtin'
                ? 'border-[#0088cc] bg-cyan-50/80 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0088cc]" /> BuiltIn Hub
              </span>
              {theme === 'builtin' && <Check className="w-4 h-4 text-[#0088cc]" />}
            </div>
            <div className="h-10 rounded-xl bg-[#071330] p-2 flex items-center gap-1.5 border border-cyan-400/30">
              <span className="w-3.5 h-3.5 rounded-full bg-[#0088cc]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#00c2ff]" />
              <span className="w-3.5 h-3.5 rounded-full bg-white" />
            </div>
            <p className="text-[11px] text-slate-600">Ocean blue & cyan tech hub layout.</p>
          </div>
        </div>
      </div>

      {/* Deduplication Parameters */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Deduplication Engine Rules
        </h3>

        <div className="space-y-3 text-xs">
          {/* Rule 1 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-200">Automatic Data Normalization</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Trim spaces, lowercase emails, extract digit-only phone numbers prior to comparison</p>
            </div>
            <input
              type="checkbox"
              checked={autoNormalize}
              onChange={(e) => setAutoNormalize(e.target.checked)}
              className="w-4 h-4 accent-[#2563eb] rounded cursor-pointer"
            />
          </div>

          {/* Rule 2 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-200">Level 1: Exact Duplicate Match</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Compare normalized name, email, and phone</p>
            </div>
            <input
              type="checkbox"
              checked={level1Exact}
              onChange={(e) => setLevel1Exact(e.target.checked)}
              className="w-4 h-4 accent-[#2563eb] rounded cursor-pointer"
            />
          </div>

          {/* Rule 3 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-200">Level 2: Strong Email Collision Check</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Flag duplicate if normalized email already exists</p>
            </div>
            <input
              type="checkbox"
              checked={level2Email}
              onChange={(e) => setLevel2Email(e.target.checked)}
              className="w-4 h-4 accent-[#2563eb] rounded cursor-pointer"
            />
          </div>

          {/* Rule 4 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-200">Level 3: Strong Phone Collision Check</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Flag duplicate if normalized phone number already exists</p>
            </div>
            <input
              type="checkbox"
              checked={level3Phone}
              onChange={(e) => setLevel3Phone(e.target.checked)}
              className="w-4 h-4 accent-[#2563eb] rounded cursor-pointer"
            />
          </div>
        </div>

        {savedMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold text-center">
            Settings updated successfully!
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={handleSaveSettings}
            className="w-full py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
}
