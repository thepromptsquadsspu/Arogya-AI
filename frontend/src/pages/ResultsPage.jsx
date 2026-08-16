import React, { useState } from 'react';
import { 
  AlertTriangle, CheckCircle2, XCircle, Download, Share2, 
  RefreshCw, Info, ShieldAlert, ArrowLeft, Heart, ChevronDown, ChevronUp, Copy, Check
} from 'lucide-react';
import { generatePDFReport } from '../utils/pdfGenerator';

export default function ResultsPage({ triageResult, reportedSymptoms, onRestart }) {
  const [copiedShare, setCopiedShare] = useState(false);
  const [expandedDisease, setExpandedDisease] = useState(0); // expand first disease by default

  if (!triageResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">No Triage Data Found</h2>
        <p className="text-sm text-slate-400">Please start a symptom assessment first.</p>
        <button
          onClick={onRestart}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
        >
          Start Symptom Checker
        </button>
      </div>
    );
  }

  const urgency = triageResult.primary_urgency || 'Consult GP';

  const getUrgencyBadge = () => {
    if (urgency === 'Emergency') {
      return {
        bg: 'bg-red-950/80 border-red-500/60 text-red-300 glow-red',
        icon: '🔴',
        title: 'EMERGENCY URGENCY',
        subtitle: 'Immediate medical evaluation required. Call emergency services or visit the nearest Emergency Room.'
      };
    } else if (urgency === 'Consult GP') {
      return {
        bg: 'bg-amber-950/80 border-amber-500/60 text-amber-300 glow-amber',
        icon: '🟡',
        title: 'CONSULT GP URGENCY',
        subtitle: 'Schedule an appointment with a General Practitioner within 24 to 48 hours.'
      };
    } else {
      return {
        bg: 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 glow-emerald',
        icon: '🟢',
        title: 'SELF CARE URGENCY',
        subtitle: 'Mild condition suitable for supportive self-care, rest, and hydration at home.'
      };
    }
  };

  const badgeInfo = getUrgencyBadge();

  const handleShare = () => {
    const shareText = `AegisMed Triage Assessment Result: Primary Urgency: ${urgency}. Conditions evaluated: ${triageResult.top_predictions.map(p => p.name).join(', ')}.`;
    navigator.clipboard.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Header Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Start New Triage</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
          >
            {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
            <span>{copiedShare ? 'Copied!' : 'Share Summary'}</span>
          </button>

          <button
            onClick={() => generatePDFReport(triageResult, reportedSymptoms)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md hover:from-cyan-400 hover:to-teal-400 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Urgency Badge Banner */}
      <div className={`p-8 rounded-3xl border ${badgeInfo.bg} transition-all`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{badgeInfo.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-wide">{badgeInfo.title}</h1>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-950/60 border border-white/20">
                  Triage ID #{triageResult.triage_id}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed">
                {badgeInfo.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Action Recommendation Box */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Personalized Clinical Guidance</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          {triageResult.summary_recommendation}
        </p>
      </div>

      {/* Predicted Diseases Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Predicted Conditions & Confidence Scores</h2>
          <p className="text-xs text-slate-400 mt-1">Multi-label classification results matching your reported symptom profile</p>
        </div>

        <div className="space-y-4">
          {triageResult.top_predictions.map((pred, idx) => {
            const isExpanded = expandedDisease === idx;
            return (
              <div 
                key={pred.name}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md transition hover:border-slate-700"
              >
                {/* Disease Header Bar */}
                <div 
                  onClick={() => setExpandedDisease(isExpanded ? null : idx)}
                  className="p-5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-xs text-cyan-400">
                      #{idx + 1}
                    </span>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-white">{pred.name}</h3>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          pred.urgency === 'Emergency' ? 'bg-red-950/70 border-red-800 text-red-300' :
                          pred.urgency === 'Consult GP' ? 'bg-amber-950/70 border-amber-800 text-amber-300' :
                          'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                        }`}>
                          {pred.urgency_level}
                        </span>
                      </div>

                      {/* Confidence Progress Bar */}
                      <div className="mt-2 flex items-center gap-3 max-w-md">
                        <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-700 ${
                              pred.confidence >= 70 ? 'bg-gradient-to-r from-cyan-500 to-emerald-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'
                            }`}
                            style={{ width: `${pred.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-cyan-300 shrink-0">{pred.confidence}% Match</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-slate-400 p-2">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded Details Accordion */}
                {isExpanded && (
                  <div className="p-6 border-t border-slate-800/80 bg-slate-950/60 space-y-6 animate-fade-in text-xs">
                    
                    {/* Description */}
                    <div>
                      <h4 className="font-semibold text-slate-400 mb-1">Condition Description:</h4>
                      <p className="text-slate-200">{pred.description}</p>
                    </div>

                    {/* Reasoning Explanation */}
                    <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-900/50 text-cyan-200">
                      <h4 className="font-bold text-cyan-300 mb-1">Explanation Engine:</h4>
                      <p>{pred.explanation}</p>
                    </div>

                    {/* Matched vs Missing Symptoms Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Matched Symptoms */}
                      <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/40">
                        <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Matched Reported Symptoms ({pred.matched_symptoms.length}):</span>
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {pred.matched_symptoms.map(s => (
                            <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-900/40 border border-emerald-800 text-emerald-200 text-[11px] font-medium">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing Symptoms */}
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                        <h4 className="font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-slate-500" />
                          <span>Key Unreported Symptoms:</span>
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {pred.missing_symptoms.map(s => (
                            <span key={s} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-[11px]">
                              ✗ {s}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Actionable Recommendation */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <h4 className="font-bold text-white mb-1">Recommended Action:</h4>
                      <p className="text-slate-300">{pred.recommendation}</p>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Medical Disclaimer */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400 leading-relaxed">
        <p>
          <strong className="text-slate-300">Important Medical Disclaimer:</strong> {triageResult.medical_disclaimer}
        </p>
      </div>

    </div>
  );
}
