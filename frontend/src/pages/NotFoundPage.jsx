import React from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage({ onGoHome }) {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center mx-auto">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-white">404 Page Not Found</h1>
        <p className="text-xs text-slate-400">The page or resource you requested could not be located.</p>
      </div>

      <button
        onClick={onGoHome}
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2 mx-auto"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </button>
    </div>
  );
}
