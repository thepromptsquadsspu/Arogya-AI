import React from 'react';
import { Info, ShieldCheck, Stethoscope, PhoneCall, AlertTriangle, Cpu, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-white">About AegisMed Triage Advisor</h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          An intelligent clinical decision-support application built to prioritize medical urgency, streamline symptom checking, and assist individuals in making informed healthcare decisions.
        </p>
      </div>

      {/* Triage Protocol Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <Cpu className="w-8 h-8 text-cyan-400 mb-3" />
          <h3 className="text-base font-bold text-white mb-2">Entropy Question Engine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Calculates information entropy across candidate conditions to dynamically prompt the user with the most diagnostic follow-up questions.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <Award className="w-8 h-8 text-emerald-400 mb-3" />
          <h3 className="text-base font-bold text-white mb-2">Multi-label Classification</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Uses a calibrated Random Forest classifier trained on symptom-disease co-occurrence vectors to output probability scores.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <ShieldCheck className="w-8 h-8 text-amber-400 mb-3" />
          <h3 className="text-base font-bold text-white mb-2">Anonymized Audit Logs</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Built from the ground up with strict data privacy. Zero personal identifiers (PII) are collected or persisted.
          </p>
        </div>

      </div>

      {/* Emergency Contact Numbers */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-red-500/30 backdrop-blur-md space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-red-400" />
          <span>Global Emergency Hotline Numbers</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 font-semibold">United States & Canada</span>
            <div className="text-lg font-bold text-red-400 mt-1">911</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 font-semibold">European Union & UK</span>
            <div className="text-lg font-bold text-cyan-400 mt-1">112 / 999</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 font-semibold">Australia</span>
            <div className="text-lg font-bold text-emerald-400 mt-1">000</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 font-semibold">India</span>
            <div className="text-lg font-bold text-amber-400 mt-1">112 / 102</div>
          </div>
        </div>
      </div>

      {/* Legal & Educational Notice */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
        <h4 className="font-bold text-white">Full Medical Disclaimer</h4>
        <p>
          AegisMed Triage Advisor is an educational demonstration software developed for hackathon evaluation and clinical triage decision support research. It is NOT a diagnostic tool and does not provide formal medical advice, prescription, or clinical treatment plans. If you suspect you have a medical emergency, immediately contact your local emergency services or consult a licensed medical professional.
        </p>
      </div>

    </div>
  );
}
