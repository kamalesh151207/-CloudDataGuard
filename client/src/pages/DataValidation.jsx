import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  ArrowRight,
  Fingerprint,
  Database
} from 'lucide-react';
import { recordApi } from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';

const defaultForm = {
  name: '',
  email: '',
  phone: '',
  department: 'Engineering',
  location: 'Remote'
};

export default function DataValidation({ onRecordSaved }) {
  const [formData, setFormData] = useState(defaultForm);
  const [validating, setValidating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 = form, 1..5 = validating steps
  const [result, setResult] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleValidate = async (e) => {
    e.preventDefault();
    setValidating(true);
    setResult(null);
    setApiError(null);
    setSaveSuccess(false);

    // Step 1..4 animation simulation for smooth UX
    setCurrentStep(1);
    await new Promise(r => setTimeout(r, 200));
    setCurrentStep(2);
    await new Promise(r => setTimeout(r, 200));
    setCurrentStep(3);
    await new Promise(r => setTimeout(r, 200));
    setCurrentStep(4);

    try {
      const res = await recordApi.validateRecord(formData);
      setResult(res);
      setCurrentStep(5);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to communicate with validation engine.');
      setCurrentStep(0);
    } finally {
      setValidating(false);
    }
  };

  const handleSaveRecord = async () => {
    if (!result || !result.canInsert) return;
    try {
      setSaving(true);
      setApiError(null);
      const res = await recordApi.insertRecord(formData);
      if (res.success) {
        setSaveSuccess(true);
        if (onRecordSaved) onRecordSaved();
      }
    } catch (err) {
      setApiError(err.response?.data?.reason || err.response?.data?.message || 'Database insertion failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(defaultForm);
    setResult(null);
    setCurrentStep(0);
    setSaveSuccess(false);
    setApiError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-cyan-400" /> Validate New Data Record
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Test incoming data against RFC email regex, phone digit length, and 3-level database redundancy checks.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear Form
        </button>
      </div>

      {/* 5-Step Process Indicator */}
      <div className="grid grid-cols-5 gap-2 p-3 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-xl text-[11px] font-semibold shadow-sm">
        {[
          { step: 1, title: '1. Input Validation' },
          { step: 2, title: '2. Normalize Data' },
          { step: 3, title: '3. DB Collision Check' },
          { step: 4, title: '4. Classification' },
          { step: 5, title: '5. Verification Result' },
        ].map((item) => (
          <div
            key={item.step}
            className={`p-2 rounded-lg text-center transition-all ${
              currentStep === item.step
                ? 'bg-indigo-50 dark:bg-cyan-950 text-indigo-700 dark:text-cyan-400 border border-indigo-200 dark:border-cyan-800/80 font-bold'
                : currentStep > item.step
                ? 'bg-emerald-50 dark:bg-slate-800/80 text-emerald-700 dark:text-emerald-400'
                : 'bg-slate-50 dark:bg-slate-900/40 text-slate-400'
            }`}
          >
            {item.title}
          </div>
        ))}
      </div>

      {/* Main Validation Form & Result Card */}
      {!result ? (
        <form onSubmit={handleValidate} className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" /> Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Kumar"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" /> Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. RAHUL@GMAIL.COM"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" /> Phone Number *
              </label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 (987) 654-3210"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" /> Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              >
                <option value="Engineering">Engineering</option>
                <option value="Cloud Security">Cloud Security</option>
                <option value="Data Ops">Data Ops</option>
                <option value="DevOps">DevOps</option>
                <option value="AI & Analytics">AI & Analytics</option>
                <option value="Compliance">Compliance</option>
              </select>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" /> Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bangalore, India"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {apiError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {apiError}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={validating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {validating ? (
                <span>Validating & Running Deduplication Checks...</span>
              ) : (
                <>
                  <span>Validate Record</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Validation Result UI */
        <div className="space-y-6">
          {/* UNIQUE & VERIFIED RESULT */}
          {result.status === 'unique' && (
            <div className="p-6 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 shadow-md space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      Record Verified & Eligible
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                      This record is unique and contains zero cloud database collisions.
                    </p>
                  </div>
                </div>

                <StatusBadge status="unique" />
              </div>

              {/* Normalized Data Preview */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4" /> Clean Normalized Payload
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                  <div>Name: <span className="text-slate-900 dark:text-white font-sans font-bold">{result.normalizedData.name}</span></div>
                  <div>Email: <span className="text-indigo-600 dark:text-cyan-300 font-bold">{result.normalizedData.email}</span></div>
                  <div>Phone: <span className="text-indigo-600 dark:text-cyan-300 font-bold">{result.normalizedData.phone}</span></div>
                  <div>Department: <span className="text-slate-900 dark:text-white font-sans font-bold">{result.normalizedData.department}</span></div>
                </div>
              </div>

              {saveSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center flex items-center justify-center space-x-2 shadow-md">
                  <Database className="w-4 h-4" />
                  <span>Unique record successfully stored in MongoDB Atlas!</span>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveRecord}
                    disabled={saving}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Inserting to MongoDB...' : 'Save Record'}</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition"
                  >
                    Validate Another
                  </button>
                </div>
              )}
            </div>
          )}

          {/* REDUNDANT RESULT */}
          {result.status === 'redundant' && (
            <div className="p-6 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 shadow-md space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <XCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Redundant Record Detected
                    </h3>
                    <p className="text-xs text-rose-700 dark:text-rose-400 font-semibold">
                      Insertion blocked to protect database accuracy and efficiency.
                    </p>
                  </div>
                </div>

                <StatusBadge status="redundant" />
              </div>

              {/* Collision Details */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  Rejection Reason
                </h4>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold">{result.reason}</p>

                {result.existingRecord && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">Colliding Existing Entry:</p>
                    <p className="font-mono text-slate-800 dark:text-slate-200">ID: {result.existingRecord.id}</p>
                    <p>Owner: {result.existingRecord.name} ({result.existingRecord.email})</p>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                >
                  Back to Validation
                </button>
              </div>
            </div>
          )}

          {/* INVALID RESULT */}
          {result.status === 'invalid' && (
            <div className="p-6 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 shadow-md space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Validation Failed (False Positive / Schema Error)
                    </h3>
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
                      Record failed formatting checks and cannot be processed.
                    </p>
                  </div>
                </div>

                <StatusBadge status="invalid" />
              </div>

              {/* Exact Validation Errors List */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Formatting Errors Detected
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-800 dark:text-amber-200 space-y-1 font-medium">
                  {result.errors?.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>

              <div>
                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                >
                  Back to Validation
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
