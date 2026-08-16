import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-slate-900/90 border-b border-cyan-900/50 px-4 py-2.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <p>
            <strong className="text-cyan-300">Medical Disclaimer:</strong> This application is an educational triage assistant and is NOT a substitute for professional medical advice, diagnosis, or emergency care.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
