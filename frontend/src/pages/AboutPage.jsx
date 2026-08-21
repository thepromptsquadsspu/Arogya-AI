import React from 'react';
import { 
  Info, ShieldCheck, Stethoscope, PhoneCall, AlertTriangle, 
  Cpu, Award, BookOpen, CheckCircle2, HelpCircle, FileText, Navigation 
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-semibold">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>User Instruction Manual & Clinical Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">About Aarogya AI</h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          An intelligent clinical decision-support application built to analyze symptoms, categorize medical urgency, and guide users to appropriate healthcare resources.
        </p>
      </div>

      {/* Step-by-step User Instruction Manual */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <span>Step-by-Step User Instruction Manual</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 text-cyan-400 font-extrabold flex items-center justify-center text-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-white">Symptom Input</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select your main symptoms using the quick search bar, voice input button, or by picking from the 100+ symptom library palette.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-950 text-teal-400 font-extrabold flex items-center justify-center text-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-white">Dynamic AI Questions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aarogya AI calculates information entropy across candidate conditions to dynamically ask targeted follow-up questions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 font-extrabold flex items-center justify-center text-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-white">Triage & PDF Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review your urgency level (🟢/🟡/🔴), matched vs missing symptoms, and download a clinical summary PDF to share with your doctor.
            </p>
          </div>

        </div>
      </div>

      {/* Clinical Methodology Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <Cpu className="w-8 h-8 text-cyan-400 mb-3" />
          <h3 className="text-base font-bold text-white mb-2">Entropy Information Engine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Calculates information entropy across candidate medical conditions to dynamically prompt the user with the most diagnostic follow-up questions.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <Award className="w-8 h-8 text-emerald-400 mb-3" />
          <h3 className="text-base font-bold text-white mb-2">Multi-label Random Forest</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Uses a calibrated Random Forest classifier trained on 45+ diseases and 120+ symptom co-occurrence vectors to output probability scores.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <ShieldCheck className="w-8 h-8 text-amber-400 mb-3" />
          <h3 className="text-base font-bold text-white mb-2">100% Anonymous Privacy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Built from the ground up with strict data privacy. Zero personal identifiers (Name, Email, Phone, IP) are collected or persisted.
          </p>
        </div>

      </div>

      {/* Emergency Contact Numbers with India 112 Primary */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-red-500/30 backdrop-blur-md space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-red-400" />
            <span>Emergency Contact Directory</span>
          </h2>
          <span className="text-xs font-bold text-red-300 bg-red-950 px-3 py-1 rounded-full border border-red-800">
            India Primary: 112
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-red-900/60 glow-red">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold">India Emergency</span>
              <span className="text-xs text-red-400">🇮🇳 Primary</span>
            </div>
            <div className="text-xl font-black text-red-400 mt-1">112</div>
            <span className="text-[10px] text-slate-400">All-In-One Dispatch</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 font-semibold">Ambulance (India)</span>
            <div className="text-lg font-bold text-cyan-400 mt-1">102</div>
            <span className="text-[10px] text-slate-400">Medical Transport</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 font-semibold">US & Canada</span>
            <div className="text-lg font-bold text-amber-400 mt-1">911</div>
            <span className="text-[10px] text-slate-400">Emergency Line</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 font-semibold">Europe & UK</span>
            <div className="text-lg font-bold text-emerald-400 mt-1">112 / 999</div>
            <span className="text-[10px] text-slate-400">EU Unified Number</span>
          </div>
        </div>
      </div>

      {/* Full Medical Disclaimer */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
        <h4 className="font-bold text-white">Full Clinical Disclaimer</h4>
        <p>
          Aarogya AI is an educational decision-support triage assistant developed for healthcare decision support research. It is NOT a diagnostic tool and does not provide formal medical advice, prescription, or clinical treatment plans. If you suspect you have a medical emergency, immediately dial 112 (or your local emergency services) or visit the nearest emergency department.
        </p>
      </div>

    </div>
  );
}
