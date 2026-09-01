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
  const { theme, toggleTheme } = useTheme();
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
          <Sparkles className="w-4 h-4 text-cyan-400" /> Theme & Identity Settings
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-200">Interface Theme</p>
            <p className="text-[11px] text-slate-400">Primary visual identity mode for SaaS dashboard</p>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-slate-700"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Switch to Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-cyan-400" />
                <span>Switch to Dark Theme</span>
              </>
            )}
          </button>
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
