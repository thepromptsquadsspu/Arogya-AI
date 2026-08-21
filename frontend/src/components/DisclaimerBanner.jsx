import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, X } from 'lucide-react';

export default function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-cyan-900/60 px-4 py-2.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
          <p>
            <strong className="text-cyan-300 font-bold">Important Medical Disclaimer:</strong> <span className="text-slate-200">Aarogya AI is an educational decision-support triage assistant and is NOT a substitute for professional medical advice, formal diagnosis, or emergency clinical care.</span>
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition shrink-0"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
