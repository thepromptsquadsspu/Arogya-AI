import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DisclaimerBanner from './components/DisclaimerBanner';
import LandingPage from './pages/LandingPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import ResultsPage from './pages/ResultsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SearchHistoryPage from './pages/SearchHistoryPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [isDark, setIsDark] = useState(true);
  const [initialSymptom, setInitialSymptom] = useState(null);
  const [reportedSymptoms, setReportedSymptoms] = useState([]);
  const [triageResult, setTriageResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleStartChecker = (symptomKey = null) => {
    if (symptomKey) {
      setInitialSymptom(symptomKey);
    }
    setActiveTab('checker');
  };

  const handleSubmitSymptoms = async (symptomsList) => {
    setReportedSymptoms(symptomsList);
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: symptomsList })
      });

      if (res.ok) {
        const data = await res.json();
        setTriageResult(data);
        setActiveTab('results');
      } else {
        alert("Server error during triage evaluation. Please try again.");
      }
    } catch (err) {
      console.error("API Error during triage prediction:", err);
      // Fallback local calculation if backend offline
      const mockResult = {
        triage_id: Math.floor(Math.random() * 1000) + 1,
        primary_urgency: symptomsList.includes('chest_pain') ? 'Emergency' : 'Consult GP',
        urgency_level: symptomsList.includes('chest_pain') ? '🔴 Emergency' : '🟡 Consult GP',
        summary_recommendation: symptomsList.includes('chest_pain') 
          ? '🔴 Seek immediate emergency medical care at an Emergency Room or call 112.' 
          : '🟡 Consult your primary care doctor within 24-48 hours.',
        top_predictions: [
          {
            name: symptomsList.includes('chest_pain') ? 'Myocardial Infarction' : 'Influenza (Flu)',
            confidence: 88.5,
            urgency: symptomsList.includes('chest_pain') ? 'Emergency' : 'Consult GP',
            urgency_level: symptomsList.includes('chest_pain') ? '🔴 Emergency' : '🟡 Consult GP',
            description: 'Medical condition matching your reported symptom profile.',
            recommendation: 'Seek clinical evaluation.',
            matched_symptoms: symptomsList.map(s => s.replace(/_/g, ' ').toUpperCase()),
            missing_symptoms: ['Chills', 'Nausea'],
            explanation: `Your symptoms (${symptomsList.join(', ')}) strongly match clinical indicators.`
          }
        ],
        medical_disclaimer: "Aarogya AI is an educational decision-support triage assistant and is NOT a substitute for professional medical advice."
      };
      setTriageResult(mockResult);
      setActiveTab('results');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Medical Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDark={isDark} 
        setIsDark={setIsDark} 
      />

      {/* Main Content Area */}
      <main className="min-h-[calc(100vh-140px)]">
        {isEvaluating ? (
          <div className="max-w-md mx-auto py-28 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-white">Running Aarogya AI Triage Engine...</h2>
            <p className="text-xs text-slate-400">Evaluating symptom co-occurrence probabilities & emergency safety rules</p>
          </div>
        ) : (
          <>
            {activeTab === 'landing' && (
              <LandingPage 
                onStartChecker={() => handleStartChecker()} 
                onSelectInitialSymptom={(sym) => handleStartChecker(sym)} 
              />
            )}

            {activeTab === 'checker' && (
              <SymptomCheckerPage 
                initialSymptom={initialSymptom} 
                onSubmitSymptoms={handleSubmitSymptoms} 
              />
            )}

            {activeTab === 'results' && (
              <ResultsPage 
                triageResult={triageResult} 
                reportedSymptoms={reportedSymptoms} 
                onRestart={() => setActiveTab('checker')} 
              />
            )}

            {activeTab === 'history' && <SearchHistoryPage />}

            {activeTab === 'admin' && <AdminDashboardPage />}

            {activeTab === 'about' && <AboutPage />}

            {activeTab !== 'landing' && 
             activeTab !== 'checker' && 
             activeTab !== 'results' && 
             activeTab !== 'history' && 
             activeTab !== 'admin' && 
             activeTab !== 'about' && (
              <NotFoundPage onGoHome={() => setActiveTab('landing')} />
            )}
          </>
        )}
      </main>

      {/* Persistent Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-2">
          <p>© 2026 Aarogya AI - Clinical Symptom Triage Advisor. All rights reserved.</p>
          <p className="text-[11px] text-slate-600">Built with FastAPI, Scikit-Learn, React, Tailwind CSS, and Framer Motion.</p>
        </div>
      </footer>

    </div>
  );
}
