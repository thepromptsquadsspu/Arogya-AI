import React, { useState } from 'react';
import { ShieldCheck, Info, ChevronDown, ChevronUp, X, Sparkles } from 'lucide-react';

export default function DisclaimerBanner() {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative z-50 bg-gradient-to-r from-slate-950/90 via-slate-900/85 to-slate-950/90 border-b border-cyan-500/30 backdrop-blur-xl shadow-lg shadow-cyan-950/30 transition-all duration-300">
      {/* Top Animated Gradient Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 text-xs">
          
          {/* Main Professional Advisory */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-6 h-6 rounded-full bg-cyan-500/20 animate-ping" />
              <div className="relative p-1 rounded-lg bg-cyan-950 border border-cyan-700/60 text-cyan-400 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <p className="text-slate-200 leading-normal">
              <strong className="text-cyan-300 font-extrabold tracking-wide uppercase text-[11px] mr-2 inline-flex items-center gap-1">
                <span>⚕️ CLINICAL DECISION SUPPORT NOTICE</span>
              </strong>
              <span className="hidden md:inline text-slate-300">
                Aarogya AI is an educational triage advisor. It is not a substitute for professional medical advice, clinical diagnosis, or emergency care.
              </span>
              <span className="md:hidden text-slate-300">
                Educational triage tool. Not for medical diagnosis or emergency care.
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/60 text-cyan-300 text-[11px] font-semibold transition"
            >
              <Info className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">Regulatory Policy</span>
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Expandable Clinical Policy Accordion */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-300 space-y-2 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-cyan-400 block mb-1">1. Educational Scope</span>
                This system uses probabilistic machine learning to suggest potential medical conditions based on statistical symptom co-occurrence.
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">2. Emergency Protocol</span>
                If you experience severe chest pain, sudden numbness, difficulty breathing, or trauma, dial <strong>112</strong> (India) or your local hotline immediately.
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">3. Privacy Guarantee</span>
                No personally identifiable health information (PII) is stored or shared. Assessments are processed anonymously.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
