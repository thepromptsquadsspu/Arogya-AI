import React, { useState } from 'react';
import { 
  Activity, ArrowRight, ShieldCheck, Cpu, AlertTriangle, 
  CheckCircle2, Stethoscope, Search, Zap, Award, Sparkles, UserCheck 
} from 'lucide-react';

export default function LandingPage({ onStartChecker, onSelectInitialSymptom }) {
  const [quickSearch, setQuickSearch] = useState('');

  const popularSymptoms = [
    { key: 'chest_pain', label: 'Chest Pain', icon: '🫀', urgency: 'Emergency' },
    { key: 'high_fever', label: 'High Fever', icon: '🌡️', urgency: 'Consult GP' },
    { key: 'shortness_of_breath', label: 'Shortness of Breath', icon: '🫁', urgency: 'Emergency' },
    { key: 'runny_nose', label: 'Runny Nose', icon: '🤧', urgency: 'Self Care' },
    { key: 'throbbing_headache', label: 'Throbbing Headache', icon: '🤕', urgency: 'Consult GP' },
    { key: 'burning_urination', label: 'Burning Urination', icon: '💧', urgency: 'Consult GP' }
  ];

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      onSelectInitialSymptom(quickSearch.trim().toLowerCase().replace(/\s+/g, '_'));
      onStartChecker();
    }
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-emerald-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-6 shadow-inner">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span>AI-Powered Clinical Decision Support & Triage Advisor</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Intelligent Medical Symptom Triage, <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Instant Urgency Insights</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Analyze your symptoms through an interactive AI questionnaire, predict potential conditions with calibrated confidence, and get clear guidance on when to seek care.
          </p>

          {/* Quick Search Box */}
          <div className="mt-10 max-w-2xl mx-auto">
            <form onSubmit={handleQuickSubmit} className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Type a symptom (e.g. fever, chest pain, cough, headache)..."
                className="w-full pl-12 pr-36 py-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-2xl backdrop-blur-md text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <span>Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Popular Symptom Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Quick select:</span>
              {popularSymptoms.map((s) => (
                <button
                  key={s.key}
                  onClick={() => {
                    onSelectInitialSymptom(s.key);
                    onStartChecker();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 text-xs font-medium text-slate-200 transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Action Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartChecker}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-base shadow-xl shadow-cyan-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
            >
              <Activity className="w-5 h-5 text-slate-950" />
              <span>Launch Full Interactive Checker</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </section>

      {/* Urgency Categorization Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Intelligent 3-Tier Risk Triage</h2>
          <p className="text-sm text-slate-400 mt-2">Every symptom assessment provides actionable urgency categorization</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Self Care Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/60 transition shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition" />
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🟢</span>
              <div>
                <h3 className="text-lg font-bold text-emerald-400">Self Care</h3>
                <span className="text-xs text-slate-400">Low Urgency</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Suitable for mild, self-limiting conditions. Rest, stay hydrated, and monitor at home.
            </p>
            <div className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 p-3 rounded-xl border border-emerald-900/50">
              Examples: Common Cold, Seasonal Allergies, Tension Headache, Mild Muscle Strain.
            </div>
          </div>

          {/* Consult GP Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-md relative overflow-hidden group hover:border-amber-500/60 transition shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition" />
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🟡</span>
              <div>
                <h3 className="text-lg font-bold text-amber-400">Consult GP</h3>
                <span className="text-xs text-slate-400">Moderate Urgency</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Requires evaluation by a General Practitioner or clinic within 24 to 48 hours.
            </p>
            <div className="text-xs font-semibold text-amber-300 bg-amber-950/60 p-3 rounded-xl border border-amber-900/50">
              Examples: Influenza, Migraine, Gastritis, Urinary Tract Infection, Strep Throat.
            </div>
          </div>

          {/* Emergency Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-red-500/30 backdrop-blur-md relative overflow-hidden group hover:border-red-500/60 transition shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition" />
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🔴</span>
              <div>
                <h3 className="text-lg font-bold text-red-400">Emergency</h3>
                <span className="text-xs text-slate-400">Critical High Urgency</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Requires immediate medical attention at an Emergency Department or 911 dispatch.
            </p>
            <div className="text-xs font-semibold text-red-300 bg-red-950/60 p-3 rounded-xl border border-red-900/50">
              Examples: Heart Attack, Stroke, Sepsis, Severe Pneumonia, Appendicitis.
            </div>
          </div>

        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            
            <div className="flex flex-col items-center text-center p-2">
              <div className="p-3 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800/50 mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Dynamic AI Questionnaire</h4>
              <p className="text-xs text-slate-400 mt-2">Intelligent follow-up questions tailored to your symptoms using information gain entropy.</p>
            </div>

            <div className="flex flex-col items-center text-center p-2 pt-6 md:pt-2">
              <div className="p-3 rounded-2xl bg-teal-950 text-teal-400 border border-teal-800/50 mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Multi-label Prediction</h4>
              <p className="text-xs text-slate-400 mt-2">Multi-class Random Forest model assessing 45+ diseases with matched & missing symptom breakdown.</p>
            </div>

            <div className="flex flex-col items-center text-center p-2 pt-6 md:pt-2">
              <div className="p-3 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800/50 mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">100% Anonymous Privacy</h4>
              <p className="text-xs text-slate-400 mt-2">Zero personal identity (PII) stored. Only anonymous audit logs for system improvement.</p>
            </div>

            <div className="flex flex-col items-center text-center p-2 pt-6 md:pt-2">
              <div className="p-3 rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-800/50 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">PDF Clinical Summary</h4>
              <p className="text-xs text-slate-400 mt-2">Export comprehensive diagnostic summary reports directly to share with your treating physician.</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
