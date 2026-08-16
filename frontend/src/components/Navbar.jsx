import React, { useState } from 'react';
import { 
  Stethoscope, Activity, History, LayoutDashboard, Info, 
  PhoneCall, Sun, Moon, AlertTriangle, ShieldCheck, X 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isDark, setIsDark }) {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Stethoscope },
    { id: 'checker', label: 'Symptom Checker', icon: Activity, badge: 'AI Powered' },
    { id: 'history', label: 'History', icon: History },
    { id: 'admin', label: 'Admin & ML Hub', icon: LayoutDashboard },
    { id: 'about', label: 'About & Hotlines', icon: Info },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                AegisMed
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-300">
                Triage AI 2.0
              </span>
            </div>
          </div>

          {/* Nav Items (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 rounded-full p-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 relative ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-900/40' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Emergency Hotline Button */}
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-red-900/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span className="hidden sm:inline">Emergency Hotlines</span>
              <span className="sm:hidden">911</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-800/60 bg-slate-950 px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium transition ${
                  isActive ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Emergency Hotlines Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl glow-red relative">
            <button 
              onClick={() => setShowEmergencyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="p-3 bg-red-950/60 rounded-xl border border-red-800/50">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Emergency Assistance</h3>
                <p className="text-xs text-red-300">If you are facing a life-threatening crisis, call immediately.</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <a 
                href="tel:911" 
                className="flex items-center justify-between p-3.5 rounded-xl bg-red-950/80 border border-red-800/60 text-white font-bold hover:bg-red-900 transition"
              >
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 text-red-400" />
                  <span>General Emergency (US / Canada)</span>
                </div>
                <span className="text-lg text-red-300">911</span>
              </a>

              <a 
                href="tel:112" 
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-bold hover:bg-slate-800 transition"
              >
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 text-cyan-400" />
                  <span>European Emergency Number</span>
                </div>
                <span className="text-lg text-cyan-300">112</span>
              </a>

              <a 
                href="tel:18002221222" 
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-bold hover:bg-slate-800 transition"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Poison Control Hotline</span>
                </div>
                <span className="text-xs text-amber-300">1-800-222-1222</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              This triage advisor software is an educational support system and cannot dispatch emergency medical personnel.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
